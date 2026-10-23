# Input

## Root component class name

`hggs-input`

## Theme selector

```css
.hggs-input {
  /*
  ... put here variables ...
  */
}
```

## Component variables

```css
--input-border
--input-border-disabled
--input-border-focus
--input-border-invalid
--input-border-radius
--input-box-shadow-focus
--input-color-disabled
--input-font-family
--input-font-size
--input-font-size-big
--input-font-size-small
--input-height
--input-height-big
--input-height-small
--input-outline-focus
--input-padding
--input-padding-big
--input-padding-small
--input-placeholder-color
--input-placeholder-font-style
```

## HTML Structure

### Default

#### Basic HTML structure

```html
<input type="text" class="hggs-input" placeholder="write here some text..." />
```

#### Basic HTML structure with `big` modifier

```html
<input type="text" class="hggs-input hggs-input--big" placeholder="write here some text..." />
```

#### Basic HTML structure with `small` modifier

```html
<input type="text" class="hggs-input hggs-input--small" placeholder="write here some text..." />
```

#### Basic HTML structure with `disabled` modifier

```html
<input type="text" class="hggs-input hggs-input--disabled" disabled value="I'm disable" />
```

#### Basic HTML structure with `error` modifier

```html
<input type="text" class="hggs-input hggs-input--error" error value="I have errors" />
```
