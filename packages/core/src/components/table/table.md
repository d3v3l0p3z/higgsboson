# Table

## Root component class name

`hggs-table`

## Theme selector

```css
.hggs-table-wrapper {
  /*
    ... put here variables ...
  */
}
```

## Component variables (table wrapper)

```
--table-wrapper-border
--table-wrapper-border-radius
--table-wrapper-box-shadow

```

```css
.hggs-table {
  /*
    ... put here variables ...
  */
}
```

## Component variables (table)

```
--table-min-width
--table-tbody-first-row-padding-top
--table-tbody-first-column-padding-left
--table-cell-font-family
--table-cell-font-weight
--table-cell-font-size
--table-cell-font-color
--table-cell-padding
--table-cell-text-align
--table-cell-border-bottom
--table-cell-border-bottom-last-child
--table-cell-font-weight-bold
--table-cell-head-font-weight
--table-cell-head-font-size
--table-cell-head-color
--table-cell-head-background
--table-cell-head-padding
--table-cell-head-border-bottom
```

## HTML Structure

### Default

#### Basic HTML structure

```html
<div class="hggs-table-wrapper">
  <table class="hggs-table">
    <thead class="hggs-table-head">
      <tr>
        <th class="hggs-table-cell--head">Name</th>
        <th class="hggs-table-cell--head hggs-table-cell--capitalize">ID</th>
        <th class="hggs-table-cell--head">Country</th>
        <th class="hggs-table-cell--head">Phase</th>
        <th class="hggs-table-cell--head">Days Left</th>
        <th class="hggs-table-cell--head">Progress</th>
        <th class="hggs-table-cell--head">Due Date</th>
        <th class="hggs-table-cell--head">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="hggs-table-cell">GRIF_114_3 VAL CS11721</td>
        <td class="hggs-table-cell">124536845136</td>
        <td class="hggs-table-cell hggs-table-cell--bold">USA</td>
        <td class="hggs-table-cell">Preparation</td>
        <td class="hggs-table-cell">10</td>
        <td class="hggs-table-cell">20%</td>
        <td class="hggs-table-cell">31.12.2021</td>
        <td class="hggs-table-cell">...</td>
      </tr>
      <tr>
        <td class="hggs-table-cell">GRIF_114_3 VAL CS11721</td>
        <td class="hggs-table-cell">124536845136</td>
        <td class="hggs-table-cell hggs-table-cell--bold">Germany</td>
        <td class="hggs-table-cell">Pending</td>
        <td class="hggs-table-cell">2</td>
        <td class="hggs-table-cell">20%</td>
        <td class="hggs-table-cell">31.12.2021</td>
        <td class="hggs-table-cell">...</td>
      </tr>
      <tr>
        <td class="hggs-table-cell">GRIF_114_3 VAL CS11721</td>
        <td class="hggs-table-cell">124536845136</td>
        <td class="hggs-table-cell hggs-table-cell--bold">Spain</td>
        <td class="hggs-table-cell">Complete</td>
        <td class="hggs-table-cell">0</td>
        <td class="hggs-table-cell">100%</td>
        <td class="hggs-table-cell">31.12.2021</td>
        <td class="hggs-table-cell">...</td>
      </tr>
      <tr>
        <td class="hggs-table-cell">GRIF_114_3 VAL CS11721</td>
        <td class="hggs-table-cell">124536845136</td>
        <td class="hggs-table-cell hggs-table-cell--bold">USA</td>
        <td class="hggs-table-cell">Complete</td>
        <td class="hggs-table-cell">0</td>
        <td class="hggs-table-cell">100%</td>
        <td class="hggs-table-cell">31.12.2021</td>
        <td class="hggs-table-cell">...</td>
      </tr>
    </tbody>
  </table>
</div>
```
