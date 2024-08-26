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
- `npm test`: run unit tests
- `npm run typecheck`: run TypeScript compiler (no emit)

To use the database features of the app, you also need [GNU Recutils](https://www.gnu.org/software/recutils/) installed. Specifically, the commands `recsel`, `recins` and `recdel` must be in your PATH.

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

%formula: Monthly_Cost if([Is_Annual], [Cost] / 12, [Cost])
```

Formulae are parsed with the [fparser](https://www.npmjs.com/package/fparser) library, with these additions:

- `if(cond, ifTrue, ifFalse)`: a conditional function
- `year(date)`: return the year of a date

Formulae only operate on numbers, so some field values are converted when accessed:

- A non-empty string is `1`
- True is `1`
- False is `0`
- A Date is its Unix timestamp

## License

MIT &copy; [Geoff Kimball](https://geoffkimball.com)
