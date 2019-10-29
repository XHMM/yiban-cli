
# Usage
<!-- usage -->
```sh-session
$ npm install -g @xhmm/yiban-cli
$ yiban COMMAND
running command...
$ yiban (-v|--version|version)
@xhmm/yiban-cli/0.0.5 win32-x64 node-v10.16.3
$ yiban --help [COMMAND]
USAGE
  $ yiban COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`yiban card PAGENAME`](#yiban-card-pagename)
* [`yiban help [COMMAND]`](#yiban-help-command)
* [`yiban twig PROJECTNAME`](#yiban-twig-projectname)

## `yiban card PAGENAME`

新建twig页面及相关依赖(适用于易班的'公益卡片PC端'项目)

```
USAGE
  $ yiban card PAGENAME

ARGUMENTS
  PAGENAME  页面名称
```

_See code: [src\commands\card.ts](https://github.com/XHMM/yiban-cli/blob/v0.0.5/src\commands\card.ts)_

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

## `yiban twig PROJECTNAME`

新建twig项目(适用于易班的'web_pages'项目)

```
USAGE
  $ yiban twig PROJECTNAME

ARGUMENTS
  PROJECTNAME  项目名称

OPTIONS
  --page=page  (required) 页面名称
```

_See code: [src\commands\twig.ts](https://github.com/XHMM/yiban-cli/blob/v0.0.5/src\commands\twig.ts)_
<!-- commandsstop -->
