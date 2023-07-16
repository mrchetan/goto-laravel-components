import { readFileSync, existsSync } from "fs";

export function nameToPath(path: string): string {
    return `/resources/views/components/${path.replace(/\./g, "/")}.blade.php`;
}

export function nameToIndexPath(path: string): string {
    return `/resources/views/components/${path.replace(/\./g, "/")}/index.blade.php`;
}

export function nameToViewPath(path: string, workspacePath: string | undefined): string {
    const componentName = path.replace(/\./g, "/");

    try {
        // get file name from componentName
        let fileName = componentName.split("/").pop();

        // get file path that is removed from the file name
        const componentPath = componentName.replace(`${fileName}`, "");

        // file name make uppercase and remove - and _
        fileName = fileName?.replace(/[-_]/g, " ").replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase()))).replace(/\s/g, "");

        // get file path
        const filePath = `${workspacePath}/app/View/Components/${componentPath}${fileName}.php`;

        // if file not exists, return componentName
        if (!existsSync(filePath)) {
            return componentName;
        }

        // get file content from the file path
        const fileContent = readFileSync(
            filePath,
            "utf8"
        );
        // find in the return view('' location of the view file
        let viewFile = fileContent.match(/return view\(\'(.*)\'/)?.[1];

        // if not found, try to find in the return view("" without the last ) bracket check
        if (!viewFile) {
            viewFile = fileContent.match(/return view\("(.*?)"/)?.[1];
        }

        // if not found, try to find in the return view(`` without the last ) bracket check
        if (!viewFile) {
            viewFile = fileContent.match(/return view\(`(.*?)`/)?.[1];
        }

        // return the path to the view file
        return `/resources/views/${viewFile?.replace(/['"]/g, "").replace(/\./g, "/")}.blade.php`;

    } catch (error) {
        return componentName;
    }
}