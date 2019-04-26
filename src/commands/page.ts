import {Command, flags} from '@oclif/command'
import * as path from 'path'
import * as fs from 'fs'
import {promises as fsPromise} from 'fs'


export default class Page extends Command {
  static description = '新建twig页面及相关依赖(仅适用于公益卡片PC端)'
  static flags = {
    help: flags.help({char: 'h', description:"查看帮助"}),
  }

  static args = [{name: 'filename', required: true, description:"页面名称(不需写后缀,不能以点开头)", parse: (input:string)=> input.split('.',1)[0]}]

  async run() {
    const {args, flags} = this.parse(Page);
    const {dir, base, name} = path.parse(args.filename);
    const {ts, twig, scss} = genFileNames(base);
    await createFile(path.join('public/ts/devs',dir), ts, `import "scss/devs/${scss}"\n`)
    await createFile(path.join('public/scss/devs',dir), scss, '')
    await createFile(path.join('views/devs',dir), twig,
`{% extends '../layout/index.html.twig' %}

{% block content_css %}
  <link rel="stylesheet" href="/dist/devs/${base}.css">
{% endblock %}

{% block content_html %}
  ${name} page: your content here
{% endblock %}

{% block content_js %}
  <script src="/dist/devs/${base}.js"></script>
{% endblock %}`);
    const routerName = await addToRouterFile(name);
    await addToSideMenu(routerName);
    this.log('Created successfully');
    this.log(`This page router is ${routerName}`)
  }
}

function genFileNames(filename:string) {
  return {
    twig: filename+'.html.twig',
    ts: filename+'.ts',
    scss: filename+'.scss'
  }
}
async function createFile(filepath:string, filename:string, content:string, log:boolean=true) {
  if(!filepath) filepath = process.cwd();
  filepath = path.join(process.cwd(), filepath)
  if(!fs.existsSync(filepath)) await fsPromise.mkdir(filepath,{recursive:true} );
  const fullPath = path.join(filepath, filename);
  log && console.log(`Creating file ${fullPath}`)
  await fsPromise.writeFile(fullPath, content)
}
async function addToRouterFile(filenameWithoutExt:string,log:boolean=true) {
  const routerFileFullPath = path.join(process.cwd(), 'router.ts')
  if(!fs.existsSync(routerFileFullPath)) {
    throw new Error("当前目录不存在router.ts文件，请确保其存在并内容与模板相同")
  }
  log && console.log(`Updating router file`);
  const router = `/${filenameWithoutExt}`
  await fsPromise.writeFile(routerFileFullPath, `\nrouter.get('${router}', (req, res) => {
  res.render('devs/${filenameWithoutExt}.html.twig', {
    asset: _asset,
    path:_path
  })
})`, { flag:'a'})
  return router;
}
async function addToSideMenu(router:string,log:boolean=true) {
  const sign = '{#INSERT SIGN[不要修改我]#}';
  const sideMenuFileFullPath = path.join(process.cwd(), 'views/layout/sideMenu.html.twig')
  if(!fs.existsSync(sideMenuFileFullPath)) {
    throw new Error("当前目录不存在views/layout/sideMenu.html.twig目录文件，请确保其存在并内容与模板相同")
  }
  log && console.log("Updating sideMenu file")
  const content = await fsPromise.readFile(sideMenuFileFullPath, {encoding:'utf8'})
  const contentByLine = content.split('\n')
  const startLine = contentByLine.findIndex( item => item.includes(sign)) + 1;
  contentByLine.splice(startLine,0, `  <div class="mdc-list">
      <div class="mdc-list-item" data-to="${router}" id="page_${router.slice(1)}">
        <i class="iconfont icon-home mdc-list-item__graphic " aria-hidden="true"></i>
        <span class="mdc-list-item__text">[DEV] ${router.slice(1)}页面</span>
      </div>
      <hr class="mdc-list-divider">
    </div>`)
  await fsPromise.writeFile(sideMenuFileFullPath, contentByLine.join('\n'), {flag: 'w'})
}
