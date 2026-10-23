# Dropdown

## Root component class name

`hggs-dropdown`

## Theme selector

```css
.hggs-dropdown {
  /*
  ... put here variables ...
  */
}
```

## Component variables

```
--dropdown-border
--dropdown-border-focus
--dropdown-border-radius
--dropdown-box-shadow-focus
--dropdown-height
--dropdown-icon-right
--dropdown-icon-top
--dropdown-open-icon-border
--dropdown-open-icon-border-bottom-left-radius
--dropdown-open-icon-border-focus
--dropdown-open-icon-top
--dropdown-open-size
--dropdown-option-label-background-hover
--dropdown-option-label-color
--dropdown-option-label-font-family
--dropdown-option-label-font-size
--dropdown-option-label-padding
--dropdown-option-selected-color
--dropdown-option-selected-font-family
--dropdown-option-selected-font-size
--dropdown-options-background
--dropdown-options-border
--dropdown-options-border-radius
--dropdown-options-box-shadow
--dropdown-options-max-height
--dropdown-options-selected-background
--dropdown-options-selected-padding-left
--dropdown-options-top
--dropdown-padding
```

## HTML Structure

### Default

#### Basic HTML structure

```html
<details class="hggs-dropdown" open="">
  <summary class="hggs-dropdown-selected-options">
    <input class="hggs-dropdown-selected-option" type="radio" name="hggs-dropdown-item" id="hggs-dropdown-placeholder" title="Select an item..." checked="" />
    <input class="hggs-dropdown-selected-option" type="radio" name="hggs-dropdown-item" id="hggs-dropdown-item-1" title="Item 1" />
    <input class="hggs-dropdown-selected-option" type="radio" name="hggs-dropdown-item" id="hggs-dropdown-item-2" title="Item 2" />
    <input class="hggs-dropdown-selected-option" type="radio" name="hggs-dropdown-item" id="hggs-dropdown-item-3" title="Item 3" />
    <input class="hggs-dropdown-selected-option" type="radio" name="hggs-dropdown-item" id="hggs-dropdown-item-4" title="Item 4" />
    <input class="hggs-dropdown-selected-option" type="radio" name="hggs-dropdown-item" id="hggs-dropdown-item-5" title="Item 5" />
  </summary>
  <ul class="hggs-dropdown-options">
    <li class="hggs-dropdown-option">
      <label class="hggs-dropdown-option-label" for="hggs-dropdown-placeholder"> Select an item... </label>
    </li>
    <li class="hggs-dropdown-option">
      <label class="hggs-dropdown-option-label" for="hggs-dropdown-item-1"> Item 1 </label>
    </li>
    <li class="hggs-dropdown-option">
      <label class="hggs-dropdown-option-label" for="hggs-dropdown-item-2"> Item 2 </label>
    </li>
    <li class="hggs-dropdown-option">
      <label class="hggs-dropdown-option-label" for="hggs-dropdown-item-3"> Item 3 </label>
    </li>
    <li class="hggs-dropdown-option">
      <label class="hggs-dropdown-option-label" for="hggs-dropdown-item-4"> Item 4 </label>
    </li>
    <li class="hggs-dropdown-option">
      <label class="hggs-dropdown-option-label" for="hggs-dropdown-item-5"> Item 5 </label>
    </li>
  </ul>
</details>
```
