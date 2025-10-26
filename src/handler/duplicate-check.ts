import { GameRecordsRepository } from "@/lib/supabase/game-records";
import type { CheckGameDuplicateResult, KifMetadata } from "@/types/shogi";

/**
 * 棋譜の重複をチェックする
 */
export async function checkGameDuplicate(
  gameHash: string,
  metadata?: KifMetadata
): Promise<CheckGameDuplicateResult> {
  // Phase 1: 日時情報による確実な重複検知（最優先）
  if (metadata?.startTime || metadata?.endTime) {
    const dateTimeRecords = await GameRecordsRepository.fetchByDateTime(
      metadata.startTime,
      metadata.endTime
    );

    if (dateTimeRecords.length > 0) {
      const record = dateTimeRecords[0];
      let message = "この棋譜は既に記録されています。\n";

      if (record.start_time) {
        message += `開始日時: ${record.start_time}\n`;
      }
      if (record.end_time) {
        message += `終了日時: ${record.end_time}\n`;
      }
      if (record.black_player && record.white_player) {
        message += `対戦者: ${record.black_player} vs ${record.white_player}\n`;
      }
      if (record.event) {
        message += `イベント: ${record.event}\n`;
      }

      message += "\n本当に重複記録しますか？";
      return {
        isDuplicate: true,
        reason: "datetime",
        comment: message,
      };
    }
  }

  // Phase 2: ハッシュベースの重複検知（メタ情報がある場合）
  const hasMetadata =
    metadata?.startTime ||
    metadata?.endTime ||
    metadata?.blackPlayer ||
    metadata?.whitePlayer ||
    metadata?.result;
  if (hasMetadata) {
    const record = await GameRecordsRepository.fetchByGameHash(gameHash);

    if (record) {
      let message = "この棋譜は既に記録されています。\n";

      if (record.black_player && record.white_player) {
        message += `対戦者: ${record.black_player} vs ${record.white_player}\n`;
      }
      if (record.event) {
        message += `イベント: ${record.event}\n`;
      }

      message += "\n本当に重複記録しますか？";
      return {
        isDuplicate: true,
        reason: "hash",
        comment: message,
      };
    }
  }

  // Phase 3: 1日以内の同じハッシュをチェック（メタ情報がない場合）
  if (!hasMetadata) {
    const recentRecords = await GameRecordsRepository.fetchByGameHashWithinDay(
      gameHash,
      1
    );

    if (recentRecords.length > 0) {
      const recordedDate = new Date(
        recentRecords[0].recorded_at
      ).toLocaleString("ja-JP");
      return {
        isDuplicate: true,
        reason: "recent_hash",
        comment: `同じ手順の棋譜が最近記録されています。\n記録日時: ${recordedDate}\n\n手動で指した同じような対局の可能性もありますが、記録しますか？`,
      };
    }
  }

  return {
    isDuplicate: false,
    reason: "none",
    comment: "",
  };
}
