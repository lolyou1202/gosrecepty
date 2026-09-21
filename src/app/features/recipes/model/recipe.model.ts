export interface RecipeDetail {
  id: number
  name: string
  description: string
  image?: string | null
  cookingTime: number
  calories: number
  dateCreated: string
  ingredients: {
    id: number
    amount: string
  }[]
  categories: {
    id: number
  }[]
  //kitchenTime: number
  //tag_dessert?: boolean
  //tag_sweet?: boolean
  //tag_sugarFree?: boolean
  //tag_pastry?: boolean
  //tag_fish?: boolean
  //tag_soup?: boolean
  //tag_breakfast?: boolean
  //tag_light?: boolean
  //tag_mainCourse?: boolean
  //tag_healthyFood?: boolean
  //tag_salad?: boolean
  //tag_fromRestaurant?: boolean
  //tag_spicy?: boolean
  //tag_chicken?: boolean
  //tag_turkey?: boolean
  //tag_beef?: boolean
  //tag_pork?: boolean
  //proteins: number
  //fats: number
  //carbohydrates: number
  //difficulty: number // 1-5
  //sharpness: number // 1-5
  //ingredients: RecipeIngredient[]
  //statuses: Status[]
  //steps: Record<string, (RecipeStepExplanation | RecipeStepPlainText)[]>
}

//export type RecipeIngredient = {
//  name: string
//  quantity?: number
//  unit?: string // 'шт.', 'стак.', 'ст. л.', 'г.', 'кг.', 'л.'
//  grams?: number
//  isToTaste?: boolean
//}

//export type RecipeStepExplanation = {
//  type: 'explanation'
//  title?: string
//  data: string[]
//}

//export type RecipeStepPlainText = {
//  type: 'plain-text'
//  data: string
//}

export type RecipeCard = RecipeDetail

export const RECIPE_FILTER_KEYS = ['search'] as const

export const RECIPE_SORT_BY_KEYS = ['name', 'calories', 'cookingTime'] as const
