import type { ApiRange } from "@core/api/params";
import type { ChipGroupItem } from "@shared/ui/chip-group";

export interface RecipeCatalogFilterChip extends ChipGroupItem {
  range?: ApiRange
}
