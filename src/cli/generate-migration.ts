import * as mkdirp from "mkdirp";
import { fs } from "mz";
import * as path from "path";
import Config from "../Config";

export default function (table: string) {
	if (!table || !/^\w+$/.test(table)) {
		throw new Error(`Table name "${table}" is invalid.`);
	}

	const tablesDir = Config.getPath("tables");
	try {
		mkdirp.sync(tablesDir);
	} catch (err: any) {
		if (err.code === "EEXIST")
			throw new Error(`Can't create tables directory, a file already exists by that name.`);
	}


	////////////////////////////////////
	// Create table directory if it doesn't already exist
	//

	const migrationsDir = Config.getPath("migrations");
	const tableMigrationsDir = path.join(migrationsDir, table);
	try {
		mkdirp.sync(tableMigrationsDir);
	} catch (err: any) {
		if (err.code === "EEXIST")
			throw new Error(`Can't create migrations directory for table "${table}", a file already exists by that name.`);
	}


	////////////////////////////////////
	// Get previous table interface (for use in migration file)
	//

	const tableInterfaceFilePath = path.join(tablesDir, `${table}.ts`);

	let oldTableInterface: string | undefined;
	try {
		oldTableInterface = fs.readFileSync(tableInterfaceFilePath, "utf8");
	} catch { }

	if (oldTableInterface) {
		const match = oldTableInterface.match(/^export default interface \w+ ({.*})\r?\n/sm);
		if (!match) throw new Error("Previous table interface file is invalid.");
		oldTableInterface = `interface From ${match[1]}`;
	} else {
		oldTableInterface = "type From = null;";
	}


	////////////////////////////////////
	// Create table interface file
	//

	const tableInterfaceFile = `export default interface ${table} {

}
`;

	fs.writeFileSync(tableInterfaceFilePath, tableInterfaceFile);


	////////////////////////////////////
	// Create the new migrations file
	//

	const migrationsFilePath = path.join(tableMigrationsDir, `${Date.now()}.ts`);
	const migrationsFile = `import { Migration } from "typedb";
import ${table} from "${path.relative(path.dirname(migrationsFilePath), tableInterfaceFilePath).replace(/\\/g, "/").slice(0, -3)}";

${oldTableInterface}

export default new class extends Migration<From, ${table}> {
	public up () {

	}

	public down () {

	}
};
`;

	fs.writeFileSync(migrationsFilePath, migrationsFile);
}
