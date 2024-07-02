# Component Model

The component model is a javascript Object that describes the structure of a component running in our dev playground. It is used to generate the HTML and CSS for the component.

This object will describe use cases for the component in terms of CSS classes that will be applied to the component.

See here some example of a component model structure in `javascript`:

```javascript
const componentModel = {
  title: 'Box',
  classes: {
    values: ['hggs-box'],
    next: [
      {
        values: ['hggs-box-header'],
        next: [{
          values: ['hggs-box-title', 'hggs-h4'],
          next: null
        }]
      },
      {
        values: ['hggs-box-body'],
        next: null
      }
    ]
  },
  modifiers: ['hggs-list--marker']
};
```

that should be a `json`

```json
{
  "title": "Box",
  "classes": {
    "values": [
      "hggs-box"
    ],
    "next": [
      {
        "values": [
          "hggs-box-header"
        ],
        "next": [
          {
            "values": [
              "hggs-box-title",
              "hggs-h4"
            ],
            "next": null
          }
        ]
      },
      {
        "values": [
          "hggs-box-body"
        ],
        "next": null
      }
    ]
  },
  "modifiers": [
    "hggs-list--marker"
  ]
}
```

that should be valid with a `json schema`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Generated schema for Root",
  "type": "object",
  "properties": {
    "title": {
      "type": "string"
    },
    "classes": {
      "type": "object",
      "properties": {
        "values": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "next": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "values": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              },
              "next": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "values": {
                      "type": "array",
                      "items": {
                        "type": "string"
                      }
                    },
                    "next": {}
                  },
                  "required": [
                    "values",
                    "next"
                  ]
                }
              }
            },
            "required": [
              "values"
            ]
          }
        }
      },
      "required": [
        "values",
        "next"
      ]
    },
    "modifiers": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "required": [
    "title",
    "classes",
    "modifiers"
  ]
}
```
