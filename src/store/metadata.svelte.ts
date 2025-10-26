import type { KifMetadata } from "@/types/shogi";

let metadata: KifMetadata | null = $state(null);

export class MetadataStore {
  static set(value: KifMetadata | null) {
    metadata = value;
  }

  static get(): KifMetadata | null {
    return metadata;
  }

  static reset() {
    metadata = null;
  }
}
