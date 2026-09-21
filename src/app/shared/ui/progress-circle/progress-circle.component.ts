import {
  Component,
  input,
  computed,
  ChangeDetectionStrategy
} from '@angular/core'

@Component({
  selector: 'app-progress-circle',
  templateUrl: './progress-circle.component.html',
  styleUrl: './progress-circle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressCircleComponent {
  public readonly size = input<number>(24)
  public readonly strokeWidth = input<number>(4)
  public readonly variant = input<'primary' | 'secondary'>('primary')
  public readonly speed = input<string>('1s')
  // Процент заполнения (0-100)
  public readonly percent = input<number>(50)
  // Поворот (по умолчанию -90° – старт сверху)
  public readonly rotation = input<number>(-90)

  // Вычисляемые параметры
  protected readonly radius = computed(
    () => (this.size() - this.strokeWidth()) / 2
  )
  protected readonly circumference = computed(() => 2 * Math.PI * this.radius())
  protected readonly dashArray = computed(() => {
    const len = this.circumference() * (this.percent() / 100)
    return `${len} ${this.circumference()}`
  })
}
