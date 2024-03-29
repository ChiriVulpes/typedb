import { fs } from "mz";
import Task, { remove } from "./gulp/Task";
import TypescriptWatch from "./gulp/TypescriptWatch";

////////////////////////////////////
// Tasks
//

// Task.create("mocha", Pipe.create("out/tests/Main.js", { read: false })
// 	.pipe(() => mocha({ reporter: "even-more-min" }))
// 	.on("error", () => process.exitCode = 1));

new Task("compile-test", remove("out"))
	.then("compile", async () => new TypescriptWatch("src", "out").once())
	.create();

new Task("build", "compile-test")
	.then("replace-gitignore", done => {
		fs.unlink(".gitignore");
		fs.renameSync("out.gitignore", ".gitignore");
		done();
	})
	.create();

new Task("watch", remove("out"))
	.then("compile-test", async () => new TypescriptWatch("src", "out")
		// .onComplete(Task.get("mocha"))
		.watch()
		.waitForInitial())
	.create();

Task.create("default", "watch");
