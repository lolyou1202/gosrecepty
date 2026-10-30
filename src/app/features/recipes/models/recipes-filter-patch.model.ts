import { Nullable } from '@shared/utils/types/nullable'

export interface FilterPatch {
  name?: Nullable<string>
  cookingTime?: Nullable<string>
  calories?: Nullable<string>
}
