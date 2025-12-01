import { NodesStore } from "@/store/kifu-node.svelte";
import { MetadataStore } from "@/store/metadata.svelte";
import { checkGameDuplicate } from "./duplicate-check";
import { generateGameHash } from "@/domain/game-records";
import type { MoveStatisticsInsertParams } from "@/types/shogi";
import { flipMove, flipSfenx } from "@/domain/sfenx";
import { GameRecordsRepository } from "@/lib/supabase/game-records";
import { MoveStatisticsRepository } from "@/lib/supabase/move-statistics";
import { CurrentUserStore } from "@/store/auth.svelte";

export async function executeInsertKifu(nodeIndex: number) {
  const currentNode = NodesStore.getNode(nodeIndex);

  // 入力検証
  if (!currentNode) {
    console.warn("無効なノードインデックスです");
    return;
  }

  if (currentNode.isSaved) {
    console.log("既に保存済みです");
    return;
  }

  if (currentNode.move !== "resign") {
    console.warn("セーブ機能は投了状態のみで使用できます");
    return;
  }

  try {
    // 重複チェックを実行
    const nodes = NodesStore.get();
    const metadata = MetadataStore.get();
    const gameHash = await generateGameHash(nodes, 0, metadata);
    const user = CurrentUserStore.get();

    console.log(gameHash);

    const duplicateResult = await checkGameDuplicate(
      gameHash,
      metadata,
      user?.id
    );
    console.log(duplicateResult);

    // 重複がある場合、ユーザーに確認
    if (duplicateResult.isDuplicate) {
      const shouldContinue = confirm(
        `${duplicateResult.comment}\n\n続行しますか？`
      );
      if (!shouldContinue) {
        console.log("保存をキャンセルしました");
        return;
      }
    }

    // 勝者判定 (投了した側の逆が勝者)
    const winner = !currentNode.isSente;

    // 統計レコード配列を初期化
    const statisticsArray: MoveStatisticsInsertParams[] = [];

    // 現在のノードから親ノードを遡りながら統計レコードを構築
    let current = nodeIndex;
    let node = NodesStore.getNode(current);
    let moveCount = 0;
    while (node.prev !== -1) {
      const prevNode = NodesStore.getNode(node.prev);

      // 統計レコード生成
      const win = node.isSente === winner;
      const lose = !win;

      let sfenx = prevNode.sfenx;
      let move = node.move;

      if (node.isSente) {
        sfenx = flipSfenx(sfenx);
        move = flipMove(move);
      }

      statisticsArray.push({
        sfenx,
        move,
        win,
        lose,
        timeout: false, // 投了による終了のため false 固定
      });

      // 親ノードに移動
      current = node.prev;
      node = prevNode;

      moveCount += 1;
    }

    if (statisticsArray.length > 0) {
      // バルクインサート実行（統計データ）
      await MoveStatisticsRepository.bulkInsert(statisticsArray, user?.id);
      console.log(`${statisticsArray.length}件の統計レコードを保存しました`);

      await GameRecordsRepository.insert(
        gameHash,
        moveCount,
        metadata || {},
        new Date().toISOString(),
        user?.id
      );
      console.log(`ゲームレコードを保存しました（手数: ${moveCount}）`);
    }

    // isSavedフラグを更新
    NodesStore.setSaved(nodeIndex, true);
    console.log(`投了ノード（インデックス: ${nodeIndex}）を保存しました`);
  } catch (error) {
    console.error("統計データの保存に失敗しました:", error);
    throw error;
  }
}
