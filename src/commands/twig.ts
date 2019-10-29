import { Command, flags } from "@oclif/command";
import * as path from "path";
import { promises } from "fs";
import { createFile, exists, toCamelCase } from "../utils";

export default class Twig extends Command {
  static description = "新建twig项目(适用于易班的'web_pages'项目)";

  static args = [
    {
      name: "projectName",
      required: true,
      description: "项目名称",
      parse: (input: string) => input.replace(/-/g, "_").trim()
    }
  ];

  static flags = {
    page: flags.string({
      required: true,
      description: "页面名称",
      parse: (input: string) => input.replace(/-/g, "_").trim()
    })
  };

  async run() {
    try {
      const { args, flags } = this.parse(Twig);
      const rootDir = process.cwd();
      const projectName = args.projectName;
      const pageName = flags.page;
      const cameCaseProjectName = toCamelCase(projectName, "_");

      const indexRouterDir = path.join(rootDir, "routers");
      const routerDir = path.join(rootDir, `routers/twig`);
      const tsDir = path.join(rootDir, `public/src/ts/${projectName}`);
      const twigDir = path.join(rootDir, `views/${projectName}`);
      const scssDir = path.join(rootDir, `public/src/scss/${projectName}`);

      const indexRouterFile = path.join(indexRouterDir, `index.ts`);
      const routerFile = path.join(routerDir, `${projectName}.ts`);

      await createFile(scssDir, `${pageName}.scss`, "");
      await createFile(
        tsDir,
        `${pageName}.ts`,
        `import 'scss/${projectName}/${pageName}.scss';`
      );
      await createFile(
        twigDir,
        `${pageName}.html.twig`,
        `<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    {# TODO: CSS文件路径 #}
    <link rel="stylesheet" href="/${projectName}/${pageName}.css">
    <title>标题</title>
</head>
<body>

{# TODO: JS文件路径 #}
<script src="/${projectName}/${pageName}.js"></script>
</body>
</html>`
      );

      // 项目存在时
      if ([routerFile].every(exists)) {
        await addContentByComment(
          routerFile,
          `/*---[don't remove me]yiban-cli-page-router-register---*/`,
          `${cameCaseProjectName}Router.get('/', (req, res) => {
  res.render('${projectName}/${pageName}.html.twig', {});
});`
        );
      } else {
        // 项目不存在时
        await createFile(
          routerFile,
          `import * as express from 'express';
    
const ${cameCaseProjectName}Router = express.Router();

${cameCaseProjectName}Router.get('/', (req, res) => {
  res.render('${projectName}/${pageName}.html.twig', {});
});
/*---[don't remove me]yiban-cli-page-router-register---*/

export default ${cameCaseProjectName}Router;
`
        );

        await addContentByComment(
          indexRouterFile,
          `/*---[don't remove me]yiban-cli-index-router-import---*/`,
          `import ${cameCaseProjectName}Router from "./twig/${projectName}";`
        );

        await addContentByComment(
          indexRouterFile,
          `/*---[don't remove me]yiban-cli-index-router-register---*/`,
          `indexRouter.use('/${projectName}', ${cameCaseProjectName}Router)`
        );
      }
    } catch (e) {
      console.error(e);
    }
  }
}

async function addContentByComment(
  fullPath: string,
  comment: string,
  content: string
): Promise<void> {
  if (!exists(fullPath)) throw new Error(`path ${fullPath} not exists`);
  const data = await promises.readFile(fullPath, "utf8");
  const newData = data.replace(comment, `${content}\n${comment}`);
  if (data === newData)
    console.log(
      `文件${fullPath}修改前后无变化，可能是该文件内不存在注释${comment}`
    );
  else {
    await promises.writeFile(fullPath, newData);
    console.log(`Changed file ${fullPath}`);
  }
}
