interface SelectionControllerOptions<T> {
  multiple: () => boolean
  selectedIds: () => readonly T[]
  onChange: (ids: T[]) => void
}

export class SelectionController<T extends string | number> {
  constructor(private readonly _opts: SelectionControllerOptions<T>) {}

  public isSelected(id: T): boolean {
    return this._opts.selectedIds().includes(id)
  }

  public isEmpty(): boolean {
    return this._opts.selectedIds().length === 0
  }

  public select(id: T): void {
    if (this._opts.multiple()) {
      if (this.isSelected(id)) return
      this._opts.onChange([...this._opts.selectedIds(), id])
      return
    }
    if (this.isSelected(id)) return
    this._opts.onChange([id])
  }

  public toggle(id: T): void {
    this.select(id)
  }

  public clear(): void {
    this._opts.onChange([])
  }
}
