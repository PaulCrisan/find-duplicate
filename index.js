const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

const checkArgs = (args) => {
  if (args.length == 0) {
    console.log("Please provide path to search under");
    process.exit(0);
  }

  if (args.length > 1) {
    try {
      fs.statSync(args[0]);
    } catch (err) {
      if (err.code === "ENOENT") {
        console.log(
          "File or directory does not exist or first argument was not a path"
        );
        process.exit(0);
      }
    }
  } else {
    console.log("No filetype argument");
    process.exit(0);
  }

  return args;
};

const walkSync = (dir, filelist) => {
  const files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.map((file) => {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    } else {
      filelist.push(path.join(dir, file));
    }
  });
  return filelist;
};

const readFile = (filename) => {
  var contents = fs.readFileSync(filename);
  return contents;
};

const makeHash = (fileString) => {
  return crypto.createHash("md5").update(fileString).digest("hex");
};

const createAsoc = (fileListArray) => {
  let asoc = [];
  fileListArray.map((f) => {
    asoc.push({ path: f, hash: makeHash(readFile(f)) });
  });

  return asoc;
};

const endsWithAny = (suffixes, string) => {
  return suffixes.some((suffix) => {
    return string.endsWith(suffix);
  });
};

const getResult = () => {
  const args = checkArgs(process.argv.slice(2));

  const filteredArray =
    args[1].split(",").length > 1
      ? walkSync(args[0]).filter((fn) => {
          return endsWithAny(
            args[1].split(",").map((a) => "." + a),
            fn
          );
        })
      : walkSync(args[0]).filter((fn) => {
          return fn.endsWith("." + args[1]);
        });

  const asoc = createAsoc(filteredArray);

  const uniqueHash = Array.from(new Set(asoc.map((a) => a.hash)));

  let hashObj = {};

  uniqueHash.map((e) => {
    hashObj[e] = new Array();
  });
  for (let i = 0; i < asoc.length; i++) {
    for (let j = 0; j < uniqueHash.length; j++) {
      if (asoc[i].hash === uniqueHash[j]) {
        hashObj[uniqueHash[j]].push(asoc[i].path);
      }
    }
  }

  let flag = false;

  Object.values(hashObj).map((el) => {
    if (el.length > 1) {
      flag = true;

      console.log(
        "\x1b[36m%s\x1b[0m",
        "Duplicate files and their location: \n"
      );

      el.map((e) => {
        console.log("\x1b[33m", e + "\n");
      });

      console.log("\n");
    }
  });

  flag
    ? ""
    : console.log("\x1b[36m%s\x1b[0m", "No duplicate files found, yay!");
};

module.exports.getResult = getResult;
