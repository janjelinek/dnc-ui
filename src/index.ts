export { DNCClickError } from './errors.js'
export { configure, getConfig } from './config.js'
export type { DNCConfig } from './config.js'
export { createButton } from './components/button.js'
export { createSelect } from './components/select.js'
export { createSlider } from './components/slider.js'
export { createDatepicker } from './components/datepicker.js'
export { createCheckbox } from './components/checkbox.js'
export { createRadio } from './components/radio.js'
export { createToggle } from './components/toggle.js'
export { createInput } from './components/input.js'
export { createTextarea } from './components/textarea.js'
export { createSearch } from './components/search.js'
export { createNumberInput } from './components/number-input.js'
export { createLink } from './components/link.js'
export { createTabs } from './components/tabs.js'
export { createBreadcrumbs } from './components/breadcrumbs.js'
export { createPagination } from './components/pagination.js'
export { createMenu } from './components/menu.js'
export { createDropdownMenu } from './components/dropdown-menu.js'
export { createBadge } from './components/badge.js'
export { createTag } from './components/tag.js'
export { createIconButton } from './components/icon-button.js'
export { createButtonGroup } from './components/button-group.js'
export { createTooltip } from './components/tooltip.js'
export { createAlert } from './components/alert.js'
export { createPopover } from './components/popover.js'
export { createModal } from './components/modal.js'
export { createToaster } from './components/toast.js'
export { createAccordion } from './components/accordion.js'
export { createCarousel } from './components/carousel.js'
export type { ButtonOptions } from './components/button.js'
export type { SelectOptions, SelectOption } from './components/select.js'
export type { SliderOptions } from './components/slider.js'
export type { DatepickerOptions } from './components/datepicker.js'
export type { CheckboxOptions } from './components/checkbox.js'
export type { RadioOptions, RadioOption } from './components/radio.js'
export type { ToggleOptions } from './components/toggle.js'
export type { InputOptions } from './components/input.js'
export type { TextareaOptions } from './components/textarea.js'
export type { SearchOptions } from './components/search.js'
export type { NumberInputOptions } from './components/number-input.js'
export type { LinkOptions } from './components/link.js'
export type { TabsOptions, TabItem } from './components/tabs.js'
export type { BreadcrumbsOptions, BreadcrumbItem } from './components/breadcrumbs.js'
export type { PaginationOptions } from './components/pagination.js'
export type { MenuOptions, MenuItem } from './components/menu.js'
export type { DropdownMenuOptions, DropdownMenuItem } from './components/dropdown-menu.js'
export type { BadgeOptions } from './components/badge.js'
export type { TagOptions } from './components/tag.js'
export type { IconButtonOptions } from './components/icon-button.js'
export type { ButtonGroupOptions, ButtonGroupItem } from './components/button-group.js'
export type { TooltipOptions } from './components/tooltip.js'
export type { AlertOptions } from './components/alert.js'
export type { PopoverOptions } from './components/popover.js'
export type { ModalOptions, ModalController } from './components/modal.js'
export type { ToasterOptions, ToastShowOptions } from './components/toast.js'
export type { AccordionOptions, AccordionItem } from './components/accordion.js'
export type { CarouselOptions } from './components/carousel.js'

import { createButton } from './components/button.js'
import { createSelect } from './components/select.js'
import { createSlider } from './components/slider.js'
import { createDatepicker } from './components/datepicker.js'
import { createCheckbox } from './components/checkbox.js'
import { createRadio } from './components/radio.js'
import { createToggle } from './components/toggle.js'
import { createInput } from './components/input.js'
import { createTextarea } from './components/textarea.js'
import { createSearch } from './components/search.js'
import { createNumberInput } from './components/number-input.js'
import { createLink } from './components/link.js'
import { createTabs } from './components/tabs.js'
import { createBreadcrumbs } from './components/breadcrumbs.js'
import { createPagination } from './components/pagination.js'
import { createMenu } from './components/menu.js'
import { createDropdownMenu } from './components/dropdown-menu.js'
import { createBadge } from './components/badge.js'
import { createTag } from './components/tag.js'
import { createIconButton } from './components/icon-button.js'
import { createButtonGroup } from './components/button-group.js'
import { createTooltip } from './components/tooltip.js'
import { createAlert } from './components/alert.js'
import { createPopover } from './components/popover.js'
import { createModal } from './components/modal.js'
import { createToaster } from './components/toast.js'
import { createAccordion } from './components/accordion.js'
import { createCarousel } from './components/carousel.js'
import { configure, getConfig } from './config.js'
import type { ButtonOptions } from './components/button.js'
import type { SelectOptions } from './components/select.js'
import type { SliderOptions } from './components/slider.js'
import type { DatepickerOptions } from './components/datepicker.js'
import type { CheckboxOptions } from './components/checkbox.js'
import type { RadioOptions } from './components/radio.js'
import type { ToggleOptions } from './components/toggle.js'
import type { InputOptions } from './components/input.js'
import type { TextareaOptions } from './components/textarea.js'
import type { SearchOptions } from './components/search.js'
import type { NumberInputOptions } from './components/number-input.js'
import type { LinkOptions } from './components/link.js'
import type { TabsOptions } from './components/tabs.js'
import type { BreadcrumbsOptions } from './components/breadcrumbs.js'
import type { PaginationOptions } from './components/pagination.js'
import type { MenuOptions } from './components/menu.js'
import type { DropdownMenuOptions } from './components/dropdown-menu.js'
import type { BadgeOptions } from './components/badge.js'
import type { TagOptions } from './components/tag.js'
import type { IconButtonOptions } from './components/icon-button.js'
import type { ButtonGroupOptions } from './components/button-group.js'
import type { TooltipOptions } from './components/tooltip.js'
import type { AlertOptions } from './components/alert.js'
import type { PopoverOptions } from './components/popover.js'
import type { ModalOptions } from './components/modal.js'
import type { ToasterOptions } from './components/toast.js'
import type { AccordionOptions } from './components/accordion.js'
import type { CarouselOptions } from './components/carousel.js'

export const DNC = {
  configure,
  getConfig,
  button: (options: ButtonOptions) => createButton(options),
  select: (options: SelectOptions) => createSelect(options),
  slider: (options: SliderOptions) => createSlider(options),
  datepicker: (options: DatepickerOptions) => createDatepicker(options),
  checkbox: (options: CheckboxOptions) => createCheckbox(options),
  radio: (options: RadioOptions) => createRadio(options),
  toggle: (options: ToggleOptions) => createToggle(options),
  input: (options: InputOptions) => createInput(options),
  textarea: (options: TextareaOptions) => createTextarea(options),
  search: (options: SearchOptions) => createSearch(options),
  numberInput: (options: NumberInputOptions) => createNumberInput(options),
  link: (options: LinkOptions) => createLink(options),
  tabs: (options: TabsOptions) => createTabs(options),
  breadcrumbs: (options: BreadcrumbsOptions) => createBreadcrumbs(options),
  pagination: (options: PaginationOptions) => createPagination(options),
  menu: (options: MenuOptions) => createMenu(options),
  dropdownMenu: (options: DropdownMenuOptions) => createDropdownMenu(options),
  badge: (options: BadgeOptions) => createBadge(options),
  tag: (options: TagOptions) => createTag(options),
  iconButton: (options: IconButtonOptions) => createIconButton(options),
  buttonGroup: (options: ButtonGroupOptions) => createButtonGroup(options),
  tooltip: (options: TooltipOptions) => createTooltip(options),
  alert: (options: AlertOptions) => createAlert(options),
  popover: (options: PopoverOptions) => createPopover(options),
  modal: (options: ModalOptions) => createModal(options),
  toaster: (options?: ToasterOptions) => createToaster(options),
  accordion: (options: AccordionOptions) => createAccordion(options),
  carousel: (options: CarouselOptions) => createCarousel(options),
}
