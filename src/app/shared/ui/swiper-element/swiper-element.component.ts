import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  input,
  OnDestroy,
  computed,
  viewChild
} from '@angular/core'
import { register } from 'swiper/element/bundle'

register()

@Component({
  selector: 'app-swiper-element',
  templateUrl: './swiper-element.component.html',
  styleUrls: ['./swiper-element.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SwiperElementComponent implements AfterViewInit, OnDestroy {
  public swiperModifyCssCls = input<string>('')
  public swiperControlsPositionOffset = input<string>('-36px')
  public swiperControlsEnabled = input<boolean>(true)

  public slidesPerGroupAuto = input<boolean>(true)
  public slidesPerView = input<string>('auto')
  public slidesSpaceBetween = input<number>(8)
  public slidesPerGroup = input<number>(1)

  public swiperRef = viewChild.required<ElementRef>('swiperRef')

  protected navigationConfig = computed(() => {
    return this.swiperControlsEnabled()
      ? {
          nextEl: '.swiper-element-control-next',
          prevEl: '.swiper-element-control-prev'
        }
      : false
  })

  public ngAfterViewInit(): void {
    const swiperEl = this.swiperRef().nativeElement
    console.log(swiperEl)
    //Object.assign(swiperEl, {
    //  slidesPerView: this.slidesPerView(),
    //  slidesPerGroup: this.slidesPerGroup(),
    //  slidesPerGroupAuto: this.slidesPerGroupAuto(),
    //  spaceBetween: this.slidesSpaceBetween(),
    //  navigation: this.navigationConfig()
    //})
    swiperEl.initialize()
  }

  public ngOnDestroy(): void {
    this.swiperRef().nativeElement.swiper.destroy()
  }
}
