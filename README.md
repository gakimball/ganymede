# Ganymede

A no-frills, offline app for note-taking and databases.

- **Databases:** [recutils](https://www.gnu.org/software/recutils/)
  - List, Table, and Board views
- **Notes:** Markdown and [Gemtext](https://geminiprotocol.net/docs/gemtext-specification.gmi)
- **Tasks:** [\[x\]it!](https://xit.jotaen.net/)

Design principles:

- Offline
- Local files
- Plain text oriented
- Nothing fancy
- Not a feature-for-feature recreation of Notion

## Requirements

To build from source:

- Node.js
- Rust

Commands:

- `npm start`: build for development
- `npm run build`: build for production

To use the database features of the app, you also need GNU Recutils installed. Specifically, the commands `recins` and `recdel` must be in your PATH.

## Databases

`.rec` files can be displayed as databases. Records can be added, edited, or deleted.

Field metadata is defined with special fields prefixed with a percent sign, like `%rec` and `%type`. To make databases more robust, Ganymede supports some custom directives. (The recutils parsers will ignore them, even though they aren't technically valid.)

### Record body

The `%body` field defines a field as the _content_ of a page. The field will appear as a multi-line text field in the editor.

```txt
%body: Body
```

### Formula fields

The `%formula` field defines a field that computes a result based on other fields.

```txt
%allowed: Name Cost Is_Annual Monthly_Cost
%type: Cost int
%type: Is_Annual bool

%formula: Monthly_Cost if(_.Is_Annual, _.Cost / 12, _.Cost)
```

Formulae are parsed with the [fparser](https://www.npmjs.com/package/fparser) library, with these additions:

- `_`: holds the record being evaluated
- `if(cond, ifTrue, ifFalse)`: a conditional function

Formulae only operate on numbers, so some field values are converted when accessed:

- A non-empty string is `1`
- True is `1`
- False is `0`

### Multi-select fields

Recfiles support the `enum` type, which restricts a field to a set of possible values. The `%multi` field defines a multi-select field, allowing for any number of comma-separated values within a set list.

```txt
%allowed: Name Tags
%multi: Tags One Two Option_Three

Name: Name
Tags: Option_Three,Two
```

## License

MIT &copy; [Geoff Kimball](https://geoffkimball.com)
