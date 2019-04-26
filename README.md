# Usage
<!-- usage -->
```sh-session
$ npm install -g yiban-cli
$ yiban COMMAND
running command...
$ yiban (-v|--version|version)
yiban-cli/0.0.1 win32-x64 node-v10.15.3
$ yiban --help [COMMAND]
USAGE
  $ yiban COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`yiban help [COMMAND]`](#yiban-help-command)
* [`yiban page FILENAME`](#yiban-page-filename)

## `yiban help [COMMAND]`

display help for yiban

```
USAGE
  $ yiban help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.6/src\commands\help.ts)_

## `yiban page FILENAME`

新建twig页面及相关依赖(仅适用于公益卡片PC端)

```
USAGE
  $ yiban page FILENAME

ARGUMENTS
  FILENAME  页面名称(不需写后缀,不能以点开头)

OPTIONS
  -h, --help  查看帮助
```

_See code: [src\commands\page.ts](https://github.com/XHMM/yiban-cli/blob/v0.0.1/src\commands\page.ts)_
<!-- commandsstop -->