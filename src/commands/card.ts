import { Command, flags } from "@oclif/command";
import * as path from "path";
import * as fs from "fs";
import { promises as fsPromise } from "fs";
import { createFile } from "../utils";

export default class Card extends Command {
  static description = "新建twig页面及相关依赖(适用于易班的'公益卡片PC端'项目)";

  static args = [
    {
      name: "pageName",
      required: true,
      description: "页面名称",
      parse: (input: string) => input.trim()
    }
  ];

  async run() {
    const { args, flags } = this.parse(Card);
    const { dir, base, name } = path.parse(args.filename);
    const { ts, twig, scss } = genFileNames(base);
    await createFile(
      path.join("public/ts/devs", dir),
      ts,
      `import "scss/devs/${scss}"\n`
    );
    await createFile(path.join("public/scss/devs", dir), scss, "");
    await createFile(
      path.join("views/devs", dir),
      twig,
      `{% extends '../layout/index.html.twig' %}

{% block content_css %}
  <link rel="stylesheet" href="/dist/devs/${base}.css">
{% endblock %}

{% block content_html %}
  ${name} page: your content here
{% endblock %}

{% block content_js %}
  <script src="/dist/devs/${base}.js"></script>
{% endblock %}`
    );
    const routerName = await addToRouterFile(name);
    await addToSideMenu(routerName);
    this.log("Created successfully");
    this.log(`This page router is ${routerName}`);
  }
}

function genFileNames(filename: string) {
  return {
    twig: filename + ".html.twig",
    ts: filename + ".ts",
    scss: filename + ".scss"
  };
}
async function addToRouterFile(filenameWithoutExt: string) {
  const routerFileFullPath = path.join(process.cwd(), "router.ts");
  if (!fs.existsSync(routerFileFullPath)) {
    throw new Error(
      "当前目录不存在router.ts文件，请确保其存在并内容与模板相同"
    );
  }
  console.log(`Updating router file`);
  const router = `/${filenameWithoutExt}`;
  await fsPromise.writeFile(
    routerFileFullPath,
    `\nrouter.get('${router}', (req, res) => {
  res.render('devs/${filenameWithoutExt}.html.twig', {
    asset: _asset,
    path:_path
  })
})`,
    { flag: "a" }
  );
  return router;
}
async function addToSideMenu(router: string) {
  const sign = "{#INSERT SIGN[不要修改我]#}";
  const sideMenuFileFullPath = path.join(
    process.cwd(),
    "views/layout/sideMenu.html.twig"
  );
  if (!fs.existsSync(sideMenuFileFullPath)) {
    throw new Error(
      "当前目录不存在views/layout/sideMenu.html.twig目录文件，请确保其存在并内容与模板相同"
    );
  }
  console.log("Updating sideMenu file");
  const content = await fsPromise.readFile(sideMenuFileFullPath, {
    encoding: "utf8"
  });
  const contentByLine = content.split("\n");
  const startLine = contentByLine.findIndex(item => item.includes(sign)) + 1;
  contentByLine.splice(
    startLine,
    0,
    `  <div class="mdc-list">
      <div class="mdc-list-item" data-to="${router}" id="page_${router.slice(
      1
    )}">
        <i class="iconfont icon-home mdc-list-item__graphic " aria-hidden="true"></i>
        <span class="mdc-list-item__text">[DEV] ${router.slice(1)}页面</span>
      </div>
      <hr class="mdc-list-divider">
    </div>`
  );
  await fsPromise.writeFile(sideMenuFileFullPath, contentByLine.join("\n"), {
    flag: "w"
  });
}
