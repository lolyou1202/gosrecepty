import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.scss',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class RecipeComponent {}
