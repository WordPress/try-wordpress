const hn = function() {
  var t;
  return typeof process < "u" && ((t = process.release) == null ? void 0 : t.name) === "node" ? "NODE" : typeof window < "u" ? "WEB" : (
    // @ts-ignore
    typeof WorkerGlobalScope < "u" && // @ts-ignore
    self instanceof WorkerGlobalScope ? "WORKER" : "NODE"
  );
}();
if (hn === "NODE") {
  let t = function(r) {
    return new Promise(function(n, i) {
      r.onload = r.onerror = function(o) {
        r.onload = r.onerror = null, o.type === "load" ? n(r.result) : i(new Error("Failed to read the blob/file"));
      };
    });
  }, e = function() {
    const r = new Uint8Array([1, 2, 3, 4]), i = new File([r], "test").stream();
    try {
      return i.getReader({ mode: "byob" }), !0;
    } catch {
      return !1;
    }
  };
  if (typeof File > "u") {
    class r extends Blob {
      constructor(i, o, a) {
        super(i);
        let s;
        a != null && a.lastModified && (s = /* @__PURE__ */ new Date()), (!s || isNaN(s.getFullYear())) && (s = /* @__PURE__ */ new Date()), this.lastModifiedDate = s, this.lastModified = s.getMilliseconds(), this.name = o || "";
      }
    }
    global.File = r;
  }
  typeof Blob.prototype.arrayBuffer > "u" && (Blob.prototype.arrayBuffer = function() {
    const n = new FileReader();
    return n.readAsArrayBuffer(this), t(n);
  }), typeof Blob.prototype.text > "u" && (Blob.prototype.text = function() {
    const n = new FileReader();
    return n.readAsText(this), t(n);
  }), (typeof Blob.prototype.stream > "u" || !e()) && (Blob.prototype.stream = function() {
    let r = 0;
    const n = this;
    return new ReadableStream({
      type: "bytes",
      // 0.5 MB seems like a reasonable chunk size, let's adjust
      // this if needed.
      autoAllocateChunkSize: 512 * 1024,
      async pull(i) {
        const o = i.byobRequest.view, s = await n.slice(
          r,
          r + o.byteLength
        ).arrayBuffer(), u = new Uint8Array(s);
        new Uint8Array(o.buffer).set(u);
        const l = u.byteLength;
        i.byobRequest.respond(l), r += l, r >= n.size && i.close();
      }
    });
  });
}
if (hn === "NODE" && typeof CustomEvent > "u") {
  class t extends Event {
    constructor(r, n = {}) {
      super(r, n), this.detail = n.detail;
    }
    initCustomEvent() {
    }
  }
  globalThis.CustomEvent = t;
}
const yn = [
  "db.php",
  "plugins/akismet",
  "plugins/hello.php",
  "plugins/wordpress-importer",
  "mu-plugins/sqlite-database-integration",
  "mu-plugins/playground-includes",
  "mu-plugins/0-playground.php",
  "mu-plugins/0-sqlite.php",
  /*
   * Listing core themes like that here isn't ideal, especially since
   * developers may actually want to use one of them.
   * @TODO Let's give the user a choice whether or not to include them.
   */
  "themes/twentytwenty",
  "themes/twentytwentyone",
  "themes/twentytwentytwo",
  "themes/twentytwentythree",
  "themes/twentytwentyfour",
  "themes/twentytwentyfive",
  "themes/twentytwentysix"
], mn = Symbol("SleepFinished");
function Ei(t) {
  return new Promise((e) => {
    setTimeout(() => e(mn), t);
  });
}
class _i extends Error {
  constructor() {
    super("Acquiring lock timed out");
  }
}
class Pi {
  constructor({ concurrency: e, timeout: r }) {
    this._running = 0, this.concurrency = e, this.timeout = r, this.queue = [];
  }
  get remaining() {
    return this.concurrency - this.running;
  }
  get running() {
    return this._running;
  }
  async acquire() {
    for (; ; )
      if (this._running >= this.concurrency) {
        const e = new Promise((r) => {
          this.queue.push(r);
        });
        this.timeout !== void 0 ? await Promise.race([e, Ei(this.timeout)]).then(
          (r) => {
            if (r === mn)
              throw new _i();
          }
        ) : await e;
      } else {
        this._running++;
        let e = !1;
        return () => {
          e || (e = !0, this._running--, this.queue.length > 0 && this.queue.shift()());
        };
      }
  }
  async run(e) {
    const r = await this.acquire();
    try {
      return await e();
    } finally {
      r();
    }
  }
}
function C(...t) {
  function e(o) {
    return o.substring(o.length - 1) === "/";
  }
  let r = t.join("/");
  const n = r[0] === "/", i = e(r);
  return r = wn(r), !r && !n && (r = "."), r && i && !e(r) && (r += "/"), r;
}
function gn(t) {
  if (t === "/")
    return "/";
  t = wn(t);
  const e = t.lastIndexOf("/");
  return e === -1 ? "" : e === 0 ? "/" : t.substr(0, e);
}
function wn(t) {
  const e = t[0] === "/";
  return t = Si(
    t.split("/").filter((r) => !!r),
    !e
  ).join("/"), (e ? "/" : "") + t.replace(/\/$/, "");
}
function Si(t, e) {
  let r = 0;
  for (let n = t.length - 1; n >= 0; n--) {
    const i = t[n];
    i === "." ? t.splice(n, 1) : i === ".." ? (t.splice(n, 1), r++) : r && (t.splice(n, 1), r--);
  }
  if (e)
    for (; r; r--)
      t.unshift("..");
  return t;
}
function vn(t = 36, e = "!@#$%^&*()_+=-[]/.,<>?") {
  const r = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" + e;
  let n = "";
  for (let i = t; i > 0; --i)
    n += r[Math.floor(Math.random() * r.length)];
  return n;
}
function Ai() {
  return vn(36, "-_");
}
function I(t) {
  return `json_decode(base64_decode('${Fi(
    JSON.stringify(t)
  )}'), true)`;
}
function bt(t) {
  const e = {};
  for (const r in t)
    e[r] = I(t[r]);
  return e;
}
function Fi(t) {
  return xi(new TextEncoder().encode(t));
}
function xi(t) {
  const e = String.fromCodePoint(...t);
  return btoa(e);
}
const Oi = "playground-log", Sr = (t, ...e) => {
  j.dispatchEvent(
    new CustomEvent(Oi, {
      detail: {
        log: t,
        args: e
      }
    })
  );
}, Ti = (t, ...e) => {
  switch (typeof t.message == "string" ? t.message = Ut(t.message) : t.message.message && typeof t.message.message == "string" && (t.message.message = Ut(t.message.message)), t.severity) {
    case "Debug":
      console.debug(t.message, ...e);
      break;
    case "Info":
      console.info(t.message, ...e);
      break;
    case "Warn":
      console.warn(t.message, ...e);
      break;
    case "Error":
      console.error(t.message, ...e);
      break;
    case "Fatal":
      console.error(t.message, ...e);
      break;
    default:
      console.log(t.message, ...e);
  }
}, Ri = (t) => t instanceof Error ? [t.message, t.stack].join(`
`) : JSON.stringify(t, null, 2), bn = [], Ar = (t) => {
  bn.push(t);
}, Bt = (t) => {
  if (t.raw === !0)
    Ar(t.message);
  else {
    const e = Ii(
      typeof t.message == "object" ? Ri(t.message) : t.message,
      t.severity ?? "Info",
      t.prefix ?? "JavaScript"
    );
    Ar(e);
  }
};
class ki extends EventTarget {
  // constructor
  constructor(e = []) {
    super(), this.handlers = e, this.fatalErrorEvent = "playground-fatal-error";
  }
  /**
   * Get all logs.
   * @returns string[]
   */
  getLogs() {
    return this.handlers.includes(Bt) ? [...bn] : (this.error(`Logs aren't stored because the logToMemory handler isn't registered.
				If you're using a custom logger instance, make sure to register logToMemory handler.
			`), []);
  }
  /**
   * Log message with severity.
   *
   * @param message any
   * @param severity LogSeverity
   * @param raw boolean
   * @param args any
   */
  logMessage(e, ...r) {
    for (const n of this.handlers)
      n(e, ...r);
  }
  /**
   * Log message
   *
   * @param message any
   * @param args any
   */
  log(e, ...r) {
    this.logMessage(
      {
        message: e,
        severity: void 0,
        prefix: "JavaScript",
        raw: !1
      },
      ...r
    );
  }
  /**
   * Log debug message
   *
   * @param message any
   * @param args any
   */
  debug(e, ...r) {
    this.logMessage(
      {
        message: e,
        severity: "Debug",
        prefix: "JavaScript",
        raw: !1
      },
      ...r
    );
  }
  /**
   * Log info message
   *
   * @param message any
   * @param args any
   */
  info(e, ...r) {
    this.logMessage(
      {
        message: e,
        severity: "Info",
        prefix: "JavaScript",
        raw: !1
      },
      ...r
    );
  }
  /**
   * Log warning message
   *
   * @param message any
   * @param args any
   */
  warn(e, ...r) {
    this.logMessage(
      {
        message: e,
        severity: "Warn",
        prefix: "JavaScript",
        raw: !1
      },
      ...r
    );
  }
  /**
   * Log error message
   *
   * @param message any
   * @param args any
   */
  error(e, ...r) {
    this.logMessage(
      {
        message: e,
        severity: "Error",
        prefix: "JavaScript",
        raw: !1
      },
      ...r
    );
  }
}
const Ci = () => {
  try {
    if (process.env.NODE_ENV === "test")
      return [Bt, Sr];
  } catch {
  }
  return [Bt, Ti, Sr];
}, j = new ki(Ci()), Ut = (t) => t.replace(/\t/g, ""), Ii = (t, e, r) => {
  const n = /* @__PURE__ */ new Date(), i = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone: "UTC"
  }).format(n).replace(/ /g, "-"), o = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: !1,
    timeZone: "UTC",
    timeZoneName: "short"
  }).format(n), a = i + " " + o;
  return t = Ut(t), `[${a}] ${r} ${e}: ${t}`;
};
let At = 0;
const Fr = "/wordpress/wp-content/debug.log", Li = async (t) => await t.fileExists(Fr) ? await t.readFileAsText(Fr) : "", Di = (t, e) => {
  e.addEventListener("request.end", async () => {
    const r = await Li(e);
    if (r.length > At) {
      const n = r.substring(At);
      t.logMessage({
        message: n,
        raw: !0
      }), At = r.length;
    }
  }), e.addEventListener("request.error", (r) => {
    r = r, r.error && (t.logMessage({
      message: `${r.error.message} ${r.error.stack}`,
      severity: "Fatal",
      prefix: r.source === "request" ? "PHP" : "WASM Crash"
    }), t.dispatchEvent(
      new CustomEvent(t.fatalErrorEvent, {
        detail: {
          logs: t.getLogs(),
          source: r.source
        }
      })
    ));
  });
}, sr = async (t, { pluginPath: e, pluginName: r }, n) => {
  n == null || n.tracker.setCaption(`Activating ${r || e}`);
  const i = await t.documentRoot, o = await t.run({
    code: `<?php
			define( 'WP_ADMIN', true );
			require_once( ${I(i)}. "/wp-load.php" );
			require_once( ${I(i)}. "/wp-admin/includes/plugin.php" );

			// Set current user to admin
			wp_set_current_user( get_users(array('role' => 'Administrator') )[0]->ID );

			$plugin_path = ${I(e)};
			$response = false;
			if (!is_dir($plugin_path)) {
				$response = activate_plugin($plugin_path);
			}

			// Activate plugin by name if activation by path wasn't successful
			if ( null !== $response ) {
				foreach ( ( glob( $plugin_path . '/*.php' ) ?: array() ) as $file ) {
					$info = get_plugin_data( $file, false, false );
					if ( ! empty( $info['Name'] ) ) {
						$response = activate_plugin( $file );
						break;
					}
				}
			}

			if ( null === $response ) {
				die('Plugin activated successfully');
			} else if ( is_wp_error( $response ) ) {
				throw new Exception( $response->get_error_message() );
			}

			throw new Exception( 'Unable to activate plugin' );
		`
  });
  if (o.text !== "Plugin activated successfully")
    throw j.debug(o), new Error(
      `Plugin ${e} could not be activated – WordPress exited with no error. Sometimes, when $_SERVER or site options are not configured correctly, WordPress exits early with a 301 redirect. Inspect the "debug" logs in the console for more details`
    );
}, $n = async (t, { themeFolderName: e }, r) => {
  r == null || r.tracker.setCaption(`Activating ${e}`);
  const n = await t.documentRoot, i = `${n}/wp-content/themes/${e}`;
  if (!await t.fileExists(i))
    throw new Error(`
			Couldn't activate theme ${e}.
			Theme not found at the provided theme path: ${i}.
			Check the theme path to ensure it's correct.
			If the theme is not installed, you can install it using the installTheme step.
			More info can be found in the Blueprint documentation: https://wordpress.github.io/wordpress-playground/blueprints-api/steps/#ActivateThemeStep
		`);
  const o = await t.run({
    code: `<?php
			define( 'WP_ADMIN', true );
			require_once( getenv('docroot') . "/wp-load.php" );

			// Set current user to admin
			wp_set_current_user( get_users(array('role' => 'Administrator') )[0]->ID );

			switch_theme( getenv('themeFolderName') );

			if( wp_get_theme()->get_stylesheet() !== getenv('themeFolderName') ) {
				throw new Exception( 'Theme ' . getenv('themeFolderName') . ' could not be activated.' );
			}
			die('Theme activated successfully');
		`,
    env: {
      docroot: n,
      themeFolderName: e
    }
  });
  if (o.text !== "Theme activated successfully")
    throw j.debug(o), new Error(
      `Theme ${e} could not be activated – WordPress exited with no error. Sometimes, when $_SERVER or site options are not configured correctly, WordPress exits early with a 301 redirect. Inspect the "debug" logs in the console for more details`
    );
}, zi = async (t, { code: e }) => await t.run({ code: e }), Mi = async (t, { options: e }) => await t.run(e), En = async (t, { path: e }) => {
  await t.unlink(e);
}, Ni = async (t, { sql: e }, r) => {
  r == null || r.tracker.setCaption("Executing SQL Queries");
  const n = `/tmp/${Ai()}.sql`;
  await t.writeFile(
    n,
    new Uint8Array(await e.arrayBuffer())
  );
  const i = await t.documentRoot, o = bt({ docroot: i, sqlFilename: n }), a = await t.run({
    code: `<?php
		require_once ${o.docroot} . '/wp-load.php';

		$handle = fopen(${o.sqlFilename}, 'r');
		$buffer = '';

		global $wpdb;

		while ($bytes = fgets($handle)) {
			$buffer .= $bytes;

			if (!feof($handle) && substr($buffer, -1, 1) !== "
") {
				continue;
			}

			$wpdb->query($buffer);
			$buffer = '';
		}
	`
  });
  return await En(t, { path: n }), a;
}, Zt = async (t, { request: e }) => {
  j.warn(
    'Deprecated: The Blueprint step "request" is deprecated and will be removed in a future release.'
  );
  const r = await t.request(e);
  if (r.httpStatusCode > 399 || r.httpStatusCode < 200)
    throw j.warn("WordPress response was", { response: r }), new Error(
      `Request failed with status ${r.httpStatusCode}`
    );
  return r;
}, qi = `<?php

/**
 * Rewrites the wp-config.php file to ensure specific constants are defined
 * with specific values.
 *
 * Example:
 *
 * \`\`\`php
 * <?php
 * define('WP_DEBUG', true);
 * // The third define() argument is also supported:
 * define('SAVEQUERIES', false, true);
 *
 * // Expression
 * define(true ? 'WP_DEBUG_LOG' : 'WP_DEBUG_LOG', 123);
 *
 * // Guarded expressions shouldn't be wrapped twice
 * if(!defined(1 ? 'A' : 'B')) {
 *     define(1 ? 'A' : 'B', 0);
 * }
 *
 * // More advanced expression
 * define((function() use($x) {
 *     return [$x, 'a'];
 * })(), 123);
 * \`\`\`
 *
 * Rewritten with
 *
 *     $constants = [
 *        'WP_DEBUG' => false,
 *        'WP_DEBUG_LOG' => true,
 *        'SAVEQUERIES' => true,
 *        'NEW_CONSTANT' => "new constant",
 *     ];
 *
 * \`\`\`php
 * <?php
 * define('WP_DEBUG_LOG',true);
 * define('NEW_CONSTANT','new constant');
 * ?><?php
 * define('WP_DEBUG',false);
 * // The third define() argument is also supported:
 * define('SAVEQUERIES',true, true);
 *
 * // Expression
 * if(!defined($const ? 'WP_DEBUG_LOG' : 'WP_DEBUG_LOG')) {
 *      define($const ? 'WP_DEBUG_LOG' : 'WP_DEBUG_LOG', 123);
 * }
 *
 * // Guarded expressions shouldn't be wrapped twice
 * if(!defined(1 ? 'A' : 'B')) {
 *     define(1 ? 'A' : 'B', 0);
 * }
 *
 * // More advanced expression
 * if(!defined((function() use($x) {
 *    return [$x, 'a'];
 * })())) {
 *     define((function() use($x) {
 *         return [$x, 'a'];
 *     })(), 123);
 * }
 * \`\`\`
 *
 * @param mixed $content
 * @return string
 */
function rewrite_wp_config_to_define_constants($content, $constants = [])
{
    $tokens = array_reverse(token_get_all($content));
    $output = [];
    $defined_expressions = [];

    // Look through all the tokens and find the define calls
    do {
        $buffer = [];
        $name_buffer = [];
        $value_buffer = [];
        $third_arg_buffer = [];

        // Capture everything until the define call into output.
        // Capturing the define call into a buffer.
        // Example:
        //     <?php echo 'a'; define  (
        //     ^^^^^^^^^^^^^^^^^^^^^^
        //           output   |buffer
        while ($token = array_pop($tokens)) {
            if (is_array($token) && $token[0] === T_STRING && (strtolower($token[1]) === 'define' || strtolower($token[1]) === 'defined')) {
                $buffer[] = $token;
                break;
            }
            $output[] = $token;
        }

        // Maybe we didn't find a define call and reached the end of the file?
        if (!count($tokens)) {
            break;
        }

        // Keep track of the "defined" expressions that are already accounted for
        if($token[1] === 'defined') {
            $output[] = $token;
            $defined_expression = [];
            $open_parenthesis = 0;
            // Capture everything up to the opening parenthesis, including the parenthesis
            // e.g. defined  (
            //           ^^^^
            while ($token = array_pop($tokens)) {
                $output[] = $token;
                if ($token === "(") {
                    ++$open_parenthesis;
                    break;
                }
            }

            // Capture everything up to the closing parenthesis, including the parenthesis
            // e.g. defined  (
            //           ^^^^
            while ($token = array_pop($tokens)) {
                $output[] = $token;
                if ($token === ")") {
                    --$open_parenthesis;
                }
                if ($open_parenthesis === 0) {
                    break;
                }
                $defined_expression[] = $token;
            }

            $defined_expressions[] = stringify_tokens(skip_whitespace($defined_expression));
            continue;
        }

        // Capture everything up to the opening parenthesis, including the parenthesis
        // e.g. define  (
        //           ^^^^
        while ($token = array_pop($tokens)) {
            $buffer[] = $token;
            if ($token === "(") {
                break;
            }
        }

        // Capture the first argument – it's the first expression after the opening
        // parenthesis and before the comma:
        // Examples:
        //     define("WP_DEBUG", true);
        //            ^^^^^^^^^^^
        //
        //     define(count([1,2]) > 2 ? 'WP_DEBUG' : 'FOO', true);
        //            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        $open_parenthesis = 0;
        while ($token = array_pop($tokens)) {
            $buffer[] = $token;
            if ($token === "(" || $token === "[" || $token === "{") {
                ++$open_parenthesis;
            } elseif ($token === ")" || $token === "]" || $token === "}") {
                --$open_parenthesis;
            } elseif ($token === "," && $open_parenthesis === 0) {
                break;
            }

            // Don't capture the comma as a part of the constant name
            $name_buffer[] = $token;
        }

        // Capture everything until the closing parenthesis
        //     define("WP_DEBUG", true);
        //                       ^^^^^^
        $open_parenthesis = 0;
        $is_second_argument = true;
        while ($token = array_pop($tokens)) {
            $buffer[] = $token;
            if ($token === ")" && $open_parenthesis === 0) {
                // Final parenthesis of the define call.
                break;
            } else if ($token === "(" || $token === "[" || $token === "{") {
                ++$open_parenthesis;
            } elseif ($token === ")" || $token === "]" || $token === "}") {
                --$open_parenthesis;
            } elseif ($token === "," && $open_parenthesis === 0) {
                // This define call has more than 2 arguments! The third one is the
                // boolean value indicating $is_case_insensitive. Let's continue capturing
                // to $third_arg_buffer.
                $is_second_argument = false;
            }
            if ($is_second_argument) {
                $value_buffer[] = $token;
            } else {
                $third_arg_buffer[] = $token;
            }
        }

        // Capture until the semicolon
        //     define("WP_DEBUG", true)  ;
        //                             ^^^
        while ($token = array_pop($tokens)) {
            $buffer[] = $token;
            if ($token === ";") {
                break;
            }
        }

        // Decide whether $name_buffer is a constant name or an expression
        $name_token = null;
        $name_token_index = $token;
        $name_is_literal = true;
        foreach ($name_buffer as $k => $token) {
            if (is_array($token)) {
                if ($token[0] === T_WHITESPACE || $token[0] === T_COMMENT || $token[0] === T_DOC_COMMENT) {
                    continue;
                } else if ($token[0] === T_STRING || $token[0] === T_CONSTANT_ENCAPSED_STRING) {
                    $name_token = $token;
                    $name_token_index = $k;
                } else {
                    $name_is_literal = false;
                    break;
                }
            } else if ($token !== "(" && $token !== ")") {
                $name_is_literal = false;
                break;
            }
        }

        // We can't handle expressions as constant names. Let's wrap that define
        // call in an if(!defined()) statement, just in case it collides with
        // a constant name.
        if (!$name_is_literal) {
            // Ensure the defined expression is not already accounted for
            foreach ($defined_expressions as $defined_expression) {
                if ($defined_expression === stringify_tokens(skip_whitespace($name_buffer))) {
                    $output = array_merge($output, $buffer);
                    continue 2;
                }
            }
            $output = array_merge(
                $output,
                ["if(!defined("],
                $name_buffer,
                [")) {\\n     "],
                ['define('],
                $name_buffer,
                [','],
                $value_buffer,
                $third_arg_buffer,
                [");"],
                ["\\n}\\n"]
            );
            continue;
        }

        // Yay, we have a literal constant name in the buffer now. Let's
        // get its value:
        $name = eval('return ' . $name_token[1] . ';');

        // If the constant name is not in the list of constants we're looking,
        // we can ignore it.
        if (!array_key_exists($name, $constants)) {
            $output = array_merge($output, $buffer);
            continue;
        }

        // We now have a define() call that defines a constant we're looking for.
        // Let's rewrite its value to the one
        $output = array_merge(
            $output,
            ['define('],
            $name_buffer,
            [','],
            [var_export($constants[$name], true)],
            $third_arg_buffer,
            [");"]
        );

        // Remove the constant from the list so we can process any remaining
        // constants later.
        unset($constants[$name]);
    } while (count($tokens));

    // Add any constants that weren't found in the file
    if (count($constants)) {
        $prepend = [
            "<?php \\n"
        ];
        foreach ($constants as $name => $value) {
            $prepend = array_merge(
                $prepend,
                [
                    "define(",
                    var_export($name, true),
                    ',',
                    var_export($value, true),
                    ");\\n"
                ]
            );
        }
        $prepend[] = "?>";
        $output = array_merge(
            $prepend,
            $output
        );
    }

    // Translate the output tokens back into a string
    return stringify_tokens($output);
}

function stringify_tokens($tokens) {
    $output = '';
    foreach ($tokens as $token) {
        if (is_array($token)) {
            $output .= $token[1];
        } else {
            $output .= $token;
        }
    }
    return $output;
}

function skip_whitespace($tokens) {
    $output = [];
    foreach ($tokens as $token) {
        if (is_array($token) && ($token[0] === T_WHITESPACE || $token[0] === T_COMMENT || $token[0] === T_DOC_COMMENT)) {
            continue;
        }
        $output[] = $token;
    }
    return $output;
}
`, ut = async (t, { consts: e, method: r = "define-before-run" }) => {
  switch (r) {
    case "define-before-run":
      await ji(t, e);
      break;
    case "rewrite-wp-config": {
      const n = await t.documentRoot, i = C(n, "/wp-config.php"), o = await t.readFileAsText(i), a = await Wi(
        t,
        o,
        e
      );
      await t.writeFile(i, a);
      break;
    }
    default:
      throw new Error(`Invalid method: ${r}`);
  }
};
async function ji(t, e) {
  for (const r in e)
    await t.defineConstant(r, e[r]);
}
async function Wi(t, e, r) {
  await t.writeFile("/tmp/code.php", e);
  const n = bt({
    consts: r
  });
  return await t.run({
    code: `${qi}
	$wp_config_path = '/tmp/code.php';
	$wp_config = file_get_contents($wp_config_path);
	$new_wp_config = rewrite_wp_config_to_define_constants($wp_config, ${n.consts});
	file_put_contents($wp_config_path, $new_wp_config);
	`
  }), await t.readFileAsText("/tmp/code.php");
}
const Ht = async (t, { username: e = "admin", password: r = "password" } = {}, n) => {
  var o, a, s;
  n == null || n.tracker.setCaption((n == null ? void 0 : n.initialCaption) || "Logging in"), await t.request({
    url: "/wp-login.php"
  });
  const i = await t.request({
    url: "/wp-login.php",
    method: "POST",
    body: {
      log: e,
      pwd: r,
      rememberme: "forever"
    }
  });
  if (!((s = (a = (o = i.headers) == null ? void 0 : o.location) == null ? void 0 : a[0]) != null && s.includes("/wp-admin/")))
    throw j.warn("WordPress response was", {
      response: i,
      text: i.text
    }), new Error(
      `Failed to log in as ${e} with password ${r}`
    );
}, _n = async (t, { options: e }) => {
  const r = await t.documentRoot;
  await t.run({
    code: `<?php
		include ${I(r)} . '/wp-load.php';
		$site_options = ${I(e)};
		foreach($site_options as $name => $value) {
			update_option($name, $value);
		}
		echo "Success";
		`
  });
}, Bi = async (t, { meta: e, userId: r }) => {
  const n = await t.documentRoot;
  await t.run({
    code: `<?php
		include ${I(n)} . '/wp-load.php';
		$meta = ${I(e)};
		foreach($meta as $name => $value) {
			update_user_meta(${I(r)}, $name, $value);
		}
		`
  });
};
function Pn(t) {
  return t.pathname.startsWith("/scope:");
}
function Ui(t) {
  return Pn(t) ? t.pathname.split("/")[1].split(":")[1] : null;
}
const Zi = async (t) => {
  var f;
  await ut(t, {
    consts: {
      WP_ALLOW_MULTISITE: 1
    }
  });
  const e = new URL(await t.absoluteUrl);
  if (e.port !== "") {
    let d = `The current host is ${e.host}, but WordPress multisites do not support custom ports.`;
    throw e.hostname === "localhost" && (d += " For development, you can set up a playground.test domain using the instructions at https://wordpress.github.io/wordpress-playground/contributing/code."), new Error(d);
  }
  const r = e.pathname.replace(/\/$/, "") + "/", n = `${e.protocol}//${e.hostname}${r}`;
  await _n(t, {
    options: {
      siteurl: n,
      home: n
    }
  }), await Ht(t, {});
  const i = await t.documentRoot, a = (await t.run({
    code: `<?php
define( 'WP_ADMIN', true );
require_once(${I(i)} . "/wp-load.php");

// Set current user to admin
( get_users(array('role' => 'Administrator') )[0] );

require_once(${I(i)} . "/wp-admin/includes/plugin.php");
$plugins_root = ${I(i)} . "/wp-content/plugins";
$plugins = glob($plugins_root . "/*");

$deactivated_plugins = [];
foreach($plugins as $plugin_path) {
	if (str_ends_with($plugin_path, '/index.php')) {
		continue;
	}
	if (!is_dir($plugin_path)) {
		$deactivated_plugins[] = substr($plugin_path, strlen($plugins_root) + 1);
		deactivate_plugins($plugin_path);
		continue;
	}
	// Find plugin entry file
	foreach ( ( glob( $plugin_path . '/*.php' ) ?: array() ) as $file ) {
		$info = get_plugin_data( $file, false, false );
		if ( ! empty( $info['Name'] ) ) {
			deactivate_plugins( $file );
			$deactivated_plugins[] = substr($file, strlen($plugins_root) + 1);
			break;
		}
	}
}
echo json_encode($deactivated_plugins);
`
  })).json, u = (f = (await Zt(t, {
    request: {
      url: "/wp-admin/network.php"
    }
  })).text.match(
    /name="_wpnonce"\s+value="([^"]+)"/
  )) == null ? void 0 : f[1], l = await Zt(t, {
    request: {
      url: "/wp-admin/network.php",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: Hi({
        _wpnonce: u,
        _wp_http_referer: r + "wp-admin/network.php",
        sitename: "My WordPress Website Sites",
        email: "admin@localhost.com",
        submit: "Install"
      })
    }
  });
  if (l.httpStatusCode !== 200)
    throw j.warn("WordPress response was", {
      response: l,
      text: l.text,
      headers: l.headers
    }), new Error(
      `Failed to enable multisite. Response code was ${l.httpStatusCode}`
    );
  await ut(t, {
    consts: {
      MULTISITE: !0,
      SUBDOMAIN_INSTALL: !1,
      SITE_ID_CURRENT_SITE: 1,
      BLOG_ID_CURRENT_SITE: 1,
      DOMAIN_CURRENT_SITE: e.hostname,
      PATH_CURRENT_SITE: r
    }
  });
  const p = new URL(await t.absoluteUrl), c = Pn(p) ? "scope:" + Ui(p) : null;
  await t.writeFile(
    "/internal/shared/preload/sunrise.php",
    `<?php
	$_SERVER['HTTP_HOST'] = ${I(p.hostname)};
	$folder = ${I(c)};
	if ($folder && strpos($_SERVER['REQUEST_URI'],"/$folder") === false) {
		$_SERVER['REQUEST_URI'] = "/$folder/" . ltrim($_SERVER['REQUEST_URI'], '/');
	}
`
  ), await t.writeFile(
    "/internal/shared/mu-plugins/sunrise.php",
    `<?php
		if ( !defined( 'BLOG_ID_CURRENT_SITE' ) ) {
			define( 'BLOG_ID_CURRENT_SITE', 1 );
		}
`
  ), await Ht(t, {});
  for (const d of a)
    await sr(t, {
      pluginPath: d
    });
};
function Hi(t) {
  return Object.keys(t).map(
    (e) => encodeURIComponent(e) + "=" + encodeURIComponent(t[e])
  ).join("&");
}
const Vi = async (t, { fromPath: e, toPath: r }) => {
  await t.writeFile(
    r,
    await t.readFileAsBuffer(e)
  );
}, Gi = async (t, { fromPath: e, toPath: r }) => {
  await t.mv(e, r);
}, Qi = async (t, { path: e }) => {
  await t.mkdir(e);
}, Ji = async (t, { path: e }) => {
  await t.rmdir(e);
}, Sn = async (t, { path: e, data: r }) => {
  r instanceof File && (r = new Uint8Array(await r.arrayBuffer())), e.startsWith("/wordpress/wp-content/mu-plugins") && !await t.fileExists("/wordpress/wp-content/mu-plugins") && await t.mkdir("/wordpress/wp-content/mu-plugins"), await t.writeFile(e, r);
}, An = async (t, { siteUrl: e }) => {
  await ut(t, {
    consts: {
      WP_HOME: e,
      WP_SITEURL: e
    }
  });
}, Ki = async (t, { file: e }, r) => {
  var i;
  (i = r == null ? void 0 : r.tracker) == null || i.setCaption("Importing content"), await Sn(t, {
    path: "/tmp/import.wxr",
    data: e
  });
  const n = await t.documentRoot;
  await t.run({
    code: `<?php
		require ${I(n)} . '/wp-load.php';
		require ${I(n)} . '/wp-admin/includes/admin.php';

		kses_remove_filters();
		$admin_id = get_users(array('role' => 'Administrator') )[0]->ID;
        wp_set_current_user( $admin_id );
		$importer = new WXR_Importer( array(
			'fetch_attachments' => true,
			'default_author' => $admin_id
		) );
		$logger = new WP_Importer_Logger_CLI();
		$importer->set_logger( $logger );

		// Slashes from the imported content are lost if we don't call wp_slash here.
		add_action( 'wp_insert_post_data', function( $data ) {
			return wp_slash($data);
		});

		$result = $importer->import( '/tmp/import.wxr' );
		`
  });
}, Fn = async (t, { themeSlug: e = "" }, r) => {
  var i;
  (i = r == null ? void 0 : r.tracker) == null || i.setCaption("Importing theme starter content");
  const n = await t.documentRoot;
  await t.run({
    code: `<?php

		/**
		 * Ensure that the customizer loads as an admin user.
		 *
		 * For compatibility with themes, this MUST be run prior to theme inclusion, which is why this is a plugins_loaded filter instead
		 * of running _wp_customize_include() manually after load.
		 */
		function importThemeStarterContent_plugins_loaded() {
			// Set as the admin user, this ensures we can customize the site.
			wp_set_current_user(
				get_users( [ 'role' => 'Administrator' ] )[0]
			);

			// Force the site to be fresh, although it should already be.
			add_filter( 'pre_option_fresh_site', '__return_true' );

			/*
			 * Simulate this request as the customizer loading with the current theme in preview mode.
			 *
			 * See _wp_customize_include()
			 */
			$_REQUEST['wp_customize']    = 'on';
			$_REQUEST['customize_theme'] = ${I(e)} ?: get_stylesheet();

			/*
			 * Claim this is a ajax request saving settings, to avoid the preview filters being applied.
			 */
			$_REQUEST['action'] = 'customize_save';
			add_filter( 'wp_doing_ajax', '__return_true' );

			$_GET = $_REQUEST;
		}
		playground_add_filter( 'plugins_loaded', 'importThemeStarterContent_plugins_loaded', 0 );

		require ${I(n)} . '/wp-load.php';

		// Return early if there's no starter content.
		if ( ! get_theme_starter_content() ) {
			return;
		}

		// Import the Starter Content.
		$wp_customize->import_theme_starter_content();

		// Publish the changeset, which publishes the starter content.
		wp_publish_post( $wp_customize->changeset_post_id() );
		`
  });
}, Ft = "/tmp/file.zip", xn = async (t, e, r, n = !0) => {
  if (e instanceof File) {
    const o = e;
    e = Ft, await t.writeFile(
      e,
      new Uint8Array(await o.arrayBuffer())
    );
  }
  const i = bt({
    zipPath: e,
    extractToPath: r,
    overwriteFiles: n
  });
  await t.run({
    code: `<?php
        function unzip($zipPath, $extractTo, $overwriteFiles = true)
        {
            if (!is_dir($extractTo)) {
                mkdir($extractTo, 0777, true);
            }
            $zip = new ZipArchive;
            $res = $zip->open($zipPath);
            if ($res === TRUE) {
				for ($i = 0; $i < $zip->numFiles; $i++) {
					$filename = $zip->getNameIndex($i);
					$fileinfo = pathinfo($filename);
					$extractFilePath = rtrim($extractTo, '/') . '/' . $filename;
					// Check if file exists and $overwriteFiles is false
					if (!file_exists($extractFilePath) || $overwriteFiles) {
						// Extract file
						$zip->extractTo($extractTo, $filename);
					}
				}
				$zip->close();
				chmod($extractTo, 0777);
            } else {
                throw new Exception("Could not unzip file");
            }
        }
        unzip(${i.zipPath}, ${i.extractToPath}, ${i.overwriteFiles});
        `
  }), await t.fileExists(Ft) && await t.unlink(Ft);
}, lr = async (t, { zipFile: e, zipPath: r, extractToPath: n }) => {
  if (r)
    j.warn(
      'The "zipPath" option of the unzip() Blueprint step is deprecated and will be removed. Use "zipFile" instead.'
    );
  else if (!e)
    throw new Error("Either zipPath or zipFile must be provided");
  await xn(t, e || r, n);
}, Yi = async (t, { wordPressFilesZip: e, pathInZip: r = "" }) => {
  const n = await t.documentRoot;
  let i = C("/tmp", "import");
  await t.mkdir(i), await lr(t, {
    zipFile: e,
    extractToPath: i
  }), i = C(i, r);
  const o = C(i, "wp-content"), a = C(n, "wp-content");
  for (const p of yn) {
    const c = C(
      o,
      p
    );
    await xr(t, c);
    const f = C(a, p);
    await t.fileExists(f) && (await t.mkdir(gn(c)), await t.mv(f, c));
  }
  const s = C(
    i,
    "wp-content",
    "database"
  );
  await t.fileExists(s) || await t.mv(
    C(n, "wp-content", "database"),
    s
  );
  const u = await t.listFiles(i);
  for (const p of u)
    await xr(t, C(n, p)), await t.mv(
      C(i, p),
      C(n, p)
    );
  await t.rmdir(i), await An(t, {
    siteUrl: await t.absoluteUrl
  });
  const l = I(
    C(n, "wp-admin", "upgrade.php")
  );
  await t.run({
    code: `<?php
            $_GET['step'] = 'upgrade_db';
            require ${l};
            `
  });
};
async function xr(t, e) {
  await t.fileExists(e) && (await t.isDir(e) ? await t.rmdir(e) : await t.unlink(e));
}
async function Xi(t) {
  const e = await t.request({
    url: "/wp-admin/export.php?download=true&content=all"
  });
  return new File([e.bytes], "export.xml");
}
async function On(t, {
  targetPath: e,
  zipFile: r,
  ifAlreadyInstalled: n = "overwrite"
}) {
  const o = r.name.replace(/\.zip$/, ""), a = C(await t.documentRoot, "wp-content"), s = C(a, vn()), u = C(s, "assets", o);
  await t.fileExists(u) && await t.rmdir(s, {
    recursive: !0
  }), await t.mkdir(s);
  try {
    await lr(t, {
      zipFile: r,
      extractToPath: u
    });
    let l = await t.listFiles(u, {
      prependPath: !0
    });
    l = l.filter((g) => !g.endsWith("/__MACOSX"));
    const p = l.length === 1 && await t.isDir(l[0]);
    let c, f = "";
    p ? (f = l[0], c = l[0].split("/").pop()) : (f = u, c = o);
    const d = `${e}/${c}`;
    if (await t.fileExists(d)) {
      if (!await t.isDir(d))
        throw new Error(
          `Cannot install asset ${c} to ${d} because a file with the same name already exists. Note it's a file, not a directory! Is this by mistake?`
        );
      if (n === "overwrite")
        await t.rmdir(d, {
          recursive: !0
        });
      else {
        if (n === "skip")
          return {
            assetFolderPath: d,
            assetFolderName: c
          };
        throw new Error(
          `Cannot install asset ${c} to ${e} because it already exists and the ifAlreadyInstalled option was set to ${n}`
        );
      }
    }
    return await t.mv(f, d), {
      assetFolderPath: d,
      assetFolderName: c
    };
  } finally {
    await t.rmdir(s, {
      recursive: !0
    });
  }
}
function $t(t) {
  const e = t.split(".").shift().replace(/-/g, " ");
  return e.charAt(0).toUpperCase() + e.slice(1).toLowerCase();
}
const eo = async (t, { pluginZipFile: e, ifAlreadyInstalled: r, options: n = {} }, i) => {
  const o = e.name.split("/").pop() || "plugin.zip", a = $t(o);
  i == null || i.tracker.setCaption(`Installing the ${a} plugin`);
  const { assetFolderPath: s } = await On(t, {
    ifAlreadyInstalled: r,
    zipFile: e,
    targetPath: `${await t.documentRoot}/wp-content/plugins`
  });
  ("activate" in n ? n.activate : !0) && await sr(
    t,
    {
      pluginPath: s,
      pluginName: a
    },
    i
  );
}, to = async (t, { themeZipFile: e, ifAlreadyInstalled: r, options: n = {} }, i) => {
  const o = $t(e.name);
  i == null || i.tracker.setCaption(`Installing the ${o} theme`);
  const { assetFolderName: a } = await On(t, {
    ifAlreadyInstalled: r,
    zipFile: e,
    targetPath: `${await t.documentRoot}/wp-content/themes`
  });
  ("activate" in n ? n.activate : !0) && await $n(
    t,
    {
      themeFolderName: a
    },
    i
  ), ("importStarterContent" in n ? n.importStarterContent : !1) && await Fn(
    t,
    {
      themeSlug: a
    },
    i
  );
}, ro = async (t, e, r) => {
  var i;
  (i = r == null ? void 0 : r.tracker) == null || i.setCaption("Resetting WordPress data");
  const n = await t.documentRoot;
  await t.run({
    env: {
      DOCROOT: n
    },
    code: `<?php
		require getenv('DOCROOT') . '/wp-load.php';

		$GLOBALS['@pdo']->query('DELETE FROM wp_posts WHERE id > 0');
		$GLOBALS['@pdo']->query("UPDATE SQLITE_SEQUENCE SET SEQ=0 WHERE NAME='wp_posts'");

		$GLOBALS['@pdo']->query('DELETE FROM wp_postmeta WHERE post_id > 1');
		$GLOBALS['@pdo']->query("UPDATE SQLITE_SEQUENCE SET SEQ=20 WHERE NAME='wp_postmeta'");

		$GLOBALS['@pdo']->query('DELETE FROM wp_comments');
		$GLOBALS['@pdo']->query("UPDATE SQLITE_SEQUENCE SET SEQ=0 WHERE NAME='wp_comments'");

		$GLOBALS['@pdo']->query('DELETE FROM wp_commentmeta');
		$GLOBALS['@pdo']->query("UPDATE SQLITE_SEQUENCE SET SEQ=0 WHERE NAME='wp_commentmeta'");
		`
  });
}, no = async (t, { options: e }) => {
  await t.request({
    url: "/wp-admin/install.php?step=2",
    method: "POST",
    body: {
      language: "en",
      prefix: "wp_",
      weblog_title: "My WordPress Website",
      user_name: e.adminPassword || "admin",
      admin_password: e.adminPassword || "password",
      // The installation wizard demands typing the same password twice
      admin_password2: e.adminPassword || "password",
      Submit: "Install WordPress",
      pw_weak: "1",
      admin_email: "admin@localhost.com"
    }
  });
}, io = async (t, { selfContained: e = !1 } = {}) => {
  const r = "/tmp/wordpress-playground.zip", n = await t.documentRoot, i = C(n, "wp-content");
  let o = yn;
  e && (o = o.filter((u) => !u.startsWith("themes/twenty")).filter(
    (u) => u !== "mu-plugins/sqlite-database-integration"
  ));
  const a = bt({
    zipPath: r,
    wpContentPath: i,
    documentRoot: n,
    exceptPaths: o.map(
      (u) => C(n, "wp-content", u)
    ),
    additionalPaths: e ? {
      [C(n, "wp-config.php")]: "wp-config.php"
    } : {}
  });
  await ao(
    t,
    `zipDir(${a.wpContentPath}, ${a.zipPath}, array(
			'exclude_paths' => ${a.exceptPaths},
			'zip_root'      => ${a.documentRoot},
			'additional_paths' => ${a.additionalPaths}
		));`
  );
  const s = await t.readFileAsBuffer(r);
  return t.unlink(r), s;
}, oo = `<?php

function zipDir($root, $output, $options = array())
{
    $root = rtrim($root, '/');
    $additionalPaths = array_key_exists('additional_paths', $options) ? $options['additional_paths'] : array();
    $excludePaths = array_key_exists('exclude_paths', $options) ? $options['exclude_paths'] : array();
    $zip_root = array_key_exists('zip_root', $options) ? $options['zip_root'] : $root;

    $zip = new ZipArchive;
    $res = $zip->open($output, ZipArchive::CREATE);
    if ($res === TRUE) {
        $directories = array(
            $root . '/'
        );
        while (sizeof($directories)) {
            $current_dir = array_pop($directories);

            if ($handle = opendir($current_dir)) {
                while (false !== ($entry = readdir($handle))) {
                    if ($entry == '.' || $entry == '..') {
                        continue;
                    }

                    $entry = join_paths($current_dir, $entry);
                    if (in_array($entry, $excludePaths)) {
                        continue;
                    }

                    if (is_dir($entry)) {
                        $directory_path = $entry . '/';
                        array_push($directories, $directory_path);
                    } else if (is_file($entry)) {
                        $zip->addFile($entry, substr($entry, strlen($zip_root)));
                    }
                }
                closedir($handle);
            }
        }
        foreach ($additionalPaths as $disk_path => $zip_path) {
            $zip->addFile($disk_path, $zip_path);
        }
        $zip->close();
        chmod($output, 0777);
    }
}

function join_paths()
{
    $paths = array();

    foreach (func_get_args() as $arg) {
        if ($arg !== '') {
            $paths[] = $arg;
        }
    }

    return preg_replace('#/+#', '/', join('/', $paths));
}
`;
async function ao(t, e) {
  return await t.run({
    code: oo + e
  });
}
const so = async (t, { command: e, wpCliPath: r = "/tmp/wp-cli.phar" }) => {
  if (!await t.fileExists(r))
    throw new Error(`wp-cli.phar not found at ${r}`);
  let n;
  if (typeof e == "string" ? (e = e.trim(), n = lo(e)) : n = e, n.shift() !== "wp")
    throw new Error('The first argument must be "wp".');
  await t.writeFile("/tmp/stdout", ""), await t.writeFile("/tmp/stderr", ""), await t.writeFile(
    "/wordpress/run-cli.php",
    `<?php
		// Set up the environment to emulate a shell script
		// call.

		// Set SHELL_PIPE to 0 to ensure WP-CLI formats
		// the output as ASCII tables.
		// @see https://github.com/wp-cli/wp-cli/issues/1102
		putenv( 'SHELL_PIPE=0' );

		// Set the argv global.
		$GLOBALS['argv'] = array_merge([
		  "/tmp/wp-cli.phar",
		  "--path=/wordpress"
		], ${I(n)});

		// Provide stdin, stdout, stderr streams outside of
		// the CLI SAPI.
		define('STDIN', fopen('php://stdin', 'rb'));
		define('STDOUT', fopen('php://stdout', 'wb'));
		define('STDERR', fopen('php://stderr', 'wb'));

		require( ${I(r)} );
		`
  );
  const o = await t.run({
    scriptPath: "/wordpress/run-cli.php"
  });
  if (o.errors)
    throw new Error(o.errors);
  return o;
};
function lo(t) {
  let n = 0, i = "";
  const o = [];
  let a = "";
  for (let s = 0; s < t.length; s++) {
    const u = t[s];
    n === 0 ? u === '"' || u === "'" ? (n = 1, i = u) : u.match(/\s/) ? (a && o.push(a), a = "") : a += u : n === 1 && (u === "\\" ? (s++, a += t[s]) : u === i ? (n = 0, i = "") : a += u);
  }
  return a && o.push(a), o;
}
const uo = async (t, { language: e }, r) => {
  r == null || r.tracker.setCaption((r == null ? void 0 : r.initialCaption) || "Translating"), await t.defineConstant("WPLANG", e);
  const n = await t.documentRoot, o = [
    {
      url: `https://downloads.wordpress.org/translation/core/${(await t.run({
        code: `<?php
			require '${n}/wp-includes/version.php';
			echo $wp_version;
		`
      })).text}/${e}.zip`,
      type: "core"
    }
  ], s = (await t.run({
    code: `<?php
		require_once('${n}/wp-load.php');
		require_once('${n}/wp-admin/includes/plugin.php');
		echo json_encode(
			array_values(
				array_map(
					function($plugin) {
						return [
							'slug'    => $plugin['TextDomain'],
							'version' => $plugin['Version']
						];
					},
					array_filter(
						get_plugins(),
						function($plugin) {
							return !empty($plugin['TextDomain']);
						}
					)
				)
			)
		);`
  })).json;
  for (const { slug: p, version: c } of s)
    o.push({
      url: `https://downloads.wordpress.org/translation/plugin/${p}/${c}/${e}.zip`,
      type: "plugin"
    });
  const l = (await t.run({
    code: `<?php
		require_once('${n}/wp-load.php');
		require_once('${n}/wp-admin/includes/theme.php');
		echo json_encode(
			array_values(
				array_map(
					function($theme) {
						return [
							'slug'    => $theme->get('TextDomain'),
							'version' => $theme->get('Version')
						];
					},
					wp_get_themes()
				)
			)
		);`
  })).json;
  for (const { slug: p, version: c } of l)
    o.push({
      url: `https://downloads.wordpress.org/translation/theme/${p}/${c}/${e}.zip`,
      type: "theme"
    });
  await t.isDir(`${n}/wp-content/languages/plugins`) || await t.mkdir(`${n}/wp-content/languages/plugins`), await t.isDir(`${n}/wp-content/languages/themes`) || await t.mkdir(`${n}/wp-content/languages/themes`);
  for (const { url: p, type: c } of o)
    try {
      const f = await fetch(p);
      if (!f.ok)
        throw new Error(
          `Failed to download translations for ${c}: ${f.statusText}`
        );
      let d = `${n}/wp-content/languages`;
      c === "plugin" ? d += "/plugins" : c === "theme" && (d += "/themes"), await xn(
        t,
        new File([await f.blob()], `${e}-${c}.zip`),
        d
      );
    } catch (f) {
      if (c === "core")
        throw new Error(
          `Failed to download translations for WordPress. Please check if the language code ${e} is correct. You can find all available languages and translations on https://translate.wordpress.org/.`
        );
      j.warn(`Error downloading translations for ${c}: ${f}`);
    }
}, po = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  activatePlugin: sr,
  activateTheme: $n,
  cp: Vi,
  defineSiteUrl: An,
  defineWpConfigConsts: ut,
  enableMultisite: Zi,
  exportWXR: Xi,
  importThemeStarterContent: Fn,
  importWordPressFiles: Yi,
  importWxr: Ki,
  installPlugin: eo,
  installTheme: to,
  login: Ht,
  mkdir: Qi,
  mv: Gi,
  request: Zt,
  resetData: ro,
  rm: En,
  rmdir: Ji,
  runPHP: zi,
  runPHPWithOptions: Mi,
  runSql: Ni,
  runWpInstallationWizard: no,
  setSiteLanguage: uo,
  setSiteOptions: _n,
  unzip: lr,
  updateUserMeta: Bi,
  wpCLI: so,
  writeFile: Sn,
  zipWpContent: io
}, Symbol.toStringTag, { value: "Module" })), fo = 5 * 1024 * 1024;
function co(t, e) {
  const r = t.headers.get("content-length") || "", n = parseInt(r, 10) || fo;
  function i(o, a) {
    e(
      new CustomEvent("progress", {
        detail: {
          loaded: o,
          total: a
        }
      })
    );
  }
  return new Response(
    new ReadableStream({
      async start(o) {
        if (!t.body) {
          o.close();
          return;
        }
        const a = t.body.getReader();
        let s = 0;
        for (; ; )
          try {
            const { done: u, value: l } = await a.read();
            if (l && (s += l.byteLength), u) {
              i(s, s), o.close();
              break;
            } else
              i(s, n), o.enqueue(l);
          } catch (u) {
            j.error({ e: u }), o.error(u);
            break;
          }
      }
    }),
    {
      status: t.status,
      statusText: t.statusText,
      headers: t.headers
    }
  );
}
const xt = 1e-5;
class Et extends EventTarget {
  constructor({
    weight: e = 1,
    caption: r = "",
    fillTime: n = 4
  } = {}) {
    super(), this._selfWeight = 1, this._selfDone = !1, this._selfProgress = 0, this._selfCaption = "", this._isFilling = !1, this._subTrackers = [], this._weight = e, this._selfCaption = r, this._fillTime = n;
  }
  /**
   * Creates a new sub-tracker with a specific weight.
   *
   * The weight determines what percentage of the overall progress
   * the sub-tracker represents. For example, if the main tracker is
   * monitoring a process that has two stages, and the first stage
   * is expected to take twice as long as the second stage, you could
   * create the first sub-tracker with a weight of 0.67 and the second
   * sub-tracker with a weight of 0.33.
   *
   * The caption is an optional string that describes the current stage
   * of the operation. If provided, it will be used as the progress caption
   * for the sub-tracker. If not provided, the main tracker will look for
   * the next sub-tracker with a non-empty caption and use that as the progress
   * caption instead.
   *
   * Returns the newly-created sub-tracker.
   *
   * @throws {Error} If the weight of the new stage would cause the total weight of all stages to exceed 1.
   *
   * @param weight The weight of the new stage, as a decimal value between 0 and 1.
   * @param caption The caption for the new stage, which will be used as the progress caption for the sub-tracker.
   *
   * @example
   * ```ts
   * const tracker = new ProgressTracker();
   * const subTracker1 = tracker.stage(0.67, 'Slow stage');
   * const subTracker2 = tracker.stage(0.33, 'Fast stage');
   *
   * subTracker2.set(50);
   * subTracker1.set(75);
   * subTracker2.set(100);
   * subTracker1.set(100);
   * ```
   */
  stage(e, r = "") {
    if (e || (e = this._selfWeight), this._selfWeight - e < -xt)
      throw new Error(
        `Cannot add a stage with weight ${e} as the total weight of registered stages would exceed 1.`
      );
    this._selfWeight -= e;
    const n = new Et({
      caption: r,
      weight: e,
      fillTime: this._fillTime
    });
    return this._subTrackers.push(n), n.addEventListener("progress", () => this.notifyProgress()), n.addEventListener("done", () => {
      this.done && this.notifyDone();
    }), n;
  }
  /**
   * Fills the progress bar slowly over time, simulating progress.
   *
   * The progress bar is filled in a 100 steps, and each step, the progress
   * is increased by 1. If `stopBeforeFinishing` is true, the progress bar
   * will stop filling when it reaches 99% so that you can call `finish()`
   * explicitly.
   *
   * If the progress bar is filling or already filled, this method does nothing.
   *
   * @example
   * ```ts
   * const progress = new ProgressTracker({ caption: 'Processing...' });
   * progress.fillSlowly();
   * ```
   *
   * @param options Optional options.
   */
  fillSlowly({ stopBeforeFinishing: e = !0 } = {}) {
    if (this._isFilling)
      return;
    this._isFilling = !0;
    const r = 100, n = this._fillTime / r;
    this._fillInterval = setInterval(() => {
      this.set(this._selfProgress + 1), e && this._selfProgress >= 99 && clearInterval(this._fillInterval);
    }, n);
  }
  set(e) {
    this._selfProgress = Math.min(e, 100), this.notifyProgress(), this._selfProgress + xt >= 100 && this.finish();
  }
  finish() {
    this._fillInterval && clearInterval(this._fillInterval), this._selfDone = !0, this._selfProgress = 100, this._isFilling = !1, this._fillInterval = void 0, this.notifyProgress(), this.notifyDone();
  }
  get caption() {
    for (let e = this._subTrackers.length - 1; e >= 0; e--)
      if (!this._subTrackers[e].done) {
        const r = this._subTrackers[e].caption;
        if (r)
          return r;
      }
    return this._selfCaption;
  }
  setCaption(e) {
    this._selfCaption = e, this.notifyProgress();
  }
  get done() {
    return this.progress + xt >= 100;
  }
  get progress() {
    if (this._selfDone)
      return 100;
    const e = this._subTrackers.reduce(
      (r, n) => r + n.progress * n.weight,
      this._selfProgress * this._selfWeight
    );
    return Math.round(e * 1e4) / 1e4;
  }
  get weight() {
    return this._weight;
  }
  get observer() {
    return this._progressObserver || (this._progressObserver = (e) => {
      this.set(e);
    }), this._progressObserver;
  }
  get loadingListener() {
    return this._loadingListener || (this._loadingListener = (e) => {
      this.set(e.detail.loaded / e.detail.total * 100);
    }), this._loadingListener;
  }
  pipe(e) {
    e.setProgress({
      progress: this.progress,
      caption: this.caption
    }), this.addEventListener("progress", (r) => {
      e.setProgress({
        progress: r.detail.progress,
        caption: r.detail.caption
      });
    }), this.addEventListener("done", () => {
      e.setLoaded();
    });
  }
  addEventListener(e, r) {
    super.addEventListener(e, r);
  }
  removeEventListener(e, r) {
    super.removeEventListener(e, r);
  }
  notifyProgress() {
    const e = this;
    this.dispatchEvent(
      new CustomEvent("progress", {
        detail: {
          get progress() {
            return e.progress;
          },
          get caption() {
            return e.caption;
          }
        }
      })
    );
  }
  notifyDone() {
    this.dispatchEvent(new CustomEvent("done"));
  }
}
const pt = {
  0: "No error occurred. System call completed successfully.",
  1: "Argument list too long.",
  2: "Permission denied.",
  3: "Address in use.",
  4: "Address not available.",
  5: "Address family not supported.",
  6: "Resource unavailable, or operation would block.",
  7: "Connection already in progress.",
  8: "Bad file descriptor.",
  9: "Bad message.",
  10: "Device or resource busy.",
  11: "Operation canceled.",
  12: "No child processes.",
  13: "Connection aborted.",
  14: "Connection refused.",
  15: "Connection reset.",
  16: "Resource deadlock would occur.",
  17: "Destination address required.",
  18: "Mathematics argument out of domain of function.",
  19: "Reserved.",
  20: "File exists.",
  21: "Bad address.",
  22: "File too large.",
  23: "Host is unreachable.",
  24: "Identifier removed.",
  25: "Illegal byte sequence.",
  26: "Operation in progress.",
  27: "Interrupted function.",
  28: "Invalid argument.",
  29: "I/O error.",
  30: "Socket is connected.",
  31: "There is a directory under that path.",
  32: "Too many levels of symbolic links.",
  33: "File descriptor value too large.",
  34: "Too many links.",
  35: "Message too large.",
  36: "Reserved.",
  37: "Filename too long.",
  38: "Network is down.",
  39: "Connection aborted by network.",
  40: "Network unreachable.",
  41: "Too many files open in system.",
  42: "No buffer space available.",
  43: "No such device.",
  44: "There is no such file or directory OR the parent directory does not exist.",
  45: "Executable file format error.",
  46: "No locks available.",
  47: "Reserved.",
  48: "Not enough space.",
  49: "No message of the desired type.",
  50: "Protocol not available.",
  51: "No space left on device.",
  52: "Function not supported.",
  53: "The socket is not connected.",
  54: "Not a directory or a symbolic link to a directory.",
  55: "Directory not empty.",
  56: "State not recoverable.",
  57: "Not a socket.",
  58: "Not supported, or operation not supported on socket.",
  59: "Inappropriate I/O control operation.",
  60: "No such device or address.",
  61: "Value too large to be stored in data type.",
  62: "Previous owner died.",
  63: "Operation not permitted.",
  64: "Broken pipe.",
  65: "Protocol error.",
  66: "Protocol not supported.",
  67: "Protocol wrong type for socket.",
  68: "Result too large.",
  69: "Read-only file system.",
  70: "Invalid seek.",
  71: "No such process.",
  72: "Reserved.",
  73: "Connection timed out.",
  74: "Text file busy.",
  75: "Cross-device link.",
  76: "Extension: Capabilities insufficient."
};
function ho(t) {
  const e = typeof t == "object" ? t == null ? void 0 : t.errno : null;
  if (e in pt)
    return pt[e];
}
function fe(t = "") {
  return function(r, n, i) {
    const o = i.value;
    i.value = function(...a) {
      try {
        return o.apply(this, a);
      } catch (s) {
        const u = typeof s == "object" ? s == null ? void 0 : s.errno : null;
        if (u in pt) {
          const l = pt[u], p = typeof a[1] == "string" ? a[1] : null, c = p !== null ? t.replaceAll("{path}", p) : t;
          throw new Error(`${c}: ${l}`, {
            cause: s
          });
        }
        throw s;
      }
    };
  };
}
var yo = Object.defineProperty, mo = Object.getOwnPropertyDescriptor, ce = (t, e, r, n) => {
  for (var i = n > 1 ? void 0 : n ? mo(e, r) : e, o = t.length - 1, a; o >= 0; o--)
    (a = t[o]) && (i = (n ? a(e, r, i) : a(i)) || i);
  return n && i && yo(e, r, i), i;
};
const de = class Y {
  static readFileAsText(e, r) {
    return new TextDecoder().decode(Y.readFileAsBuffer(e, r));
  }
  static readFileAsBuffer(e, r) {
    return e.readFile(r);
  }
  static writeFile(e, r, n) {
    e.writeFile(r, n);
  }
  static unlink(e, r) {
    e.unlink(r);
  }
  /**
   * Moves a file or directory in the PHP filesystem to a
   * new location.
   *
   * @param oldPath The path to rename.
   * @param newPath The new path.
   */
  static mv(e, r, n) {
    try {
      const i = e.lookupPath(r).node.mount, o = Y.fileExists(e, n) ? e.lookupPath(n).node.mount : e.lookupPath(gn(n)).node.mount;
      i.mountpoint !== o.mountpoint ? (Y.copyRecursive(e, r, n), Y.rmdir(e, r, { recursive: !0 })) : e.rename(r, n);
    } catch (i) {
      const o = ho(i);
      throw o ? new Error(
        `Could not move ${r} to ${n}: ${o}`,
        {
          cause: i
        }
      ) : i;
    }
  }
  static rmdir(e, r, n = { recursive: !0 }) {
    n != null && n.recursive && Y.listFiles(e, r).forEach((i) => {
      const o = `${r}/${i}`;
      Y.isDir(e, o) ? Y.rmdir(e, o, n) : Y.unlink(e, o);
    }), e.rmdir(r);
  }
  static listFiles(e, r, n = { prependPath: !1 }) {
    if (!Y.fileExists(e, r))
      return [];
    try {
      const i = e.readdir(r).filter(
        (o) => o !== "." && o !== ".."
      );
      if (n.prependPath) {
        const o = r.replace(/\/$/, "");
        return i.map((a) => `${o}/${a}`);
      }
      return i;
    } catch (i) {
      return j.error(i, { path: r }), [];
    }
  }
  static isDir(e, r) {
    return Y.fileExists(e, r) ? e.isDir(e.lookupPath(r).node.mode) : !1;
  }
  /**
   * Checks if a file exists in the PHP filesystem.
   *
   * @param  path – The path to check.
   * @returns True if the path is a file, false otherwise.
   */
  static isFile(e, r) {
    return Y.fileExists(e, r) ? e.isFile(e.lookupPath(r).node.mode) : !1;
  }
  static fileExists(e, r) {
    try {
      return e.lookupPath(r), !0;
    } catch {
      return !1;
    }
  }
  static mkdir(e, r) {
    e.mkdirTree(r);
  }
  static copyRecursive(e, r, n) {
    const i = e.lookupPath(r).node;
    if (e.isDir(i.mode)) {
      e.mkdirTree(n);
      const o = e.readdir(r).filter(
        (a) => a !== "." && a !== ".."
      );
      for (const a of o)
        Y.copyRecursive(
          e,
          C(r, a),
          C(n, a)
        );
    } else
      e.writeFile(n, e.readFile(r));
  }
};
ce([
  fe('Could not read "{path}"')
], de, "readFileAsText", 1);
ce([
  fe('Could not read "{path}"')
], de, "readFileAsBuffer", 1);
ce([
  fe('Could not write to "{path}"')
], de, "writeFile", 1);
ce([
  fe('Could not unlink "{path}"')
], de, "unlink", 1);
ce([
  fe('Could not remove directory "{path}"')
], de, "rmdir", 1);
ce([
  fe('Could not list files in "{path}"')
], de, "listFiles", 1);
ce([
  fe('Could not stat "{path}"')
], de, "isDir", 1);
ce([
  fe('Could not stat "{path}"')
], de, "fileExists", 1);
ce([
  fe('Could not create directory "{path}"')
], de, "mkdir", 1);
ce([
  fe('Could not copy files from "{path}"')
], de, "copyRecursive", 1);
const go = {
  500: "Internal Server Error",
  502: "Bad Gateway",
  404: "Not Found",
  403: "Forbidden",
  401: "Unauthorized",
  400: "Bad Request",
  301: "Moved Permanently",
  302: "Found",
  307: "Temporary Redirect",
  308: "Permanent Redirect",
  204: "No Content",
  201: "Created",
  200: "OK"
};
class ft {
  constructor(e, r, n, i = "", o = 0) {
    this.httpStatusCode = e, this.headers = r, this.bytes = n, this.exitCode = o, this.errors = i;
  }
  static forHttpCode(e, r = "") {
    return new ft(
      e,
      {},
      new TextEncoder().encode(
        r || go[e] || ""
      )
    );
  }
  static fromRawData(e) {
    return new ft(
      e.httpStatusCode,
      e.headers,
      e.bytes,
      e.errors,
      e.exitCode
    );
  }
  toRawData() {
    return {
      headers: this.headers,
      bytes: this.bytes,
      errors: this.errors,
      exitCode: this.exitCode,
      httpStatusCode: this.httpStatusCode
    };
  }
  /**
   * Response body as JSON.
   */
  get json() {
    return JSON.parse(this.text);
  }
  /**
   * Response body as text.
   */
  get text() {
    return new TextDecoder().decode(this.bytes);
  }
}
(function() {
  var t;
  return typeof process < "u" && ((t = process.release) == null ? void 0 : t.name) === "node" ? "NODE" : typeof window < "u" ? "WEB" : typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope ? "WORKER" : "NODE";
})();
const Or = "/internal/shared/php.ini";
var Ze = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function wo(t) {
  if (t.__esModule)
    return t;
  var e = t.default;
  if (typeof e == "function") {
    var r = function n() {
      return this instanceof n ? Reflect.construct(e, arguments, this.constructor) : e.apply(this, arguments);
    };
    r.prototype = e.prototype;
  } else
    r = {};
  return Object.defineProperty(r, "__esModule", { value: !0 }), Object.keys(t).forEach(function(n) {
    var i = Object.getOwnPropertyDescriptor(t, n);
    Object.defineProperty(r, n, i.get ? i : {
      enumerable: !0,
      get: function() {
        return t[n];
      }
    });
  }), r;
}
const { hasOwnProperty: Ot } = Object.prototype, Vt = (t, e = {}) => {
  typeof e == "string" && (e = { section: e }), e.align = e.align === !0, e.newline = e.newline === !0, e.sort = e.sort === !0, e.whitespace = e.whitespace === !0 || e.align === !0, e.platform = e.platform || typeof process < "u" && process.platform, e.bracketedArray = e.bracketedArray !== !1;
  const r = e.platform === "win32" ? `\r
` : `
`, n = e.whitespace ? " = " : "=", i = [], o = e.sort ? Object.keys(t).sort() : Object.keys(t);
  let a = 0;
  e.align && (a = me(
    o.filter((l) => t[l] === null || Array.isArray(t[l]) || typeof t[l] != "object").map((l) => Array.isArray(t[l]) ? `${l}[]` : l).concat([""]).reduce((l, p) => me(l).length >= me(p).length ? l : p)
  ).length);
  let s = "";
  const u = e.bracketedArray ? "[]" : "";
  for (const l of o) {
    const p = t[l];
    if (p && Array.isArray(p))
      for (const c of p)
        s += me(`${l}${u}`).padEnd(a, " ") + n + me(c) + r;
    else
      p && typeof p == "object" ? i.push(l) : s += me(l).padEnd(a, " ") + n + me(p) + r;
  }
  e.section && s.length && (s = "[" + me(e.section) + "]" + (e.newline ? r + r : r) + s);
  for (const l of i) {
    const p = Tn(l, ".").join("\\."), c = (e.section ? e.section + "." : "") + p, f = Vt(t[l], {
      ...e,
      section: c
    });
    s.length && f.length && (s += r), s += f;
  }
  return s;
};
function Tn(t, e) {
  var r = 0, n = 0, i = 0, o = [];
  do
    if (i = t.indexOf(e, r), i !== -1) {
      if (r = i + e.length, i > 0 && t[i - 1] === "\\")
        continue;
      o.push(t.slice(n, i)), n = i + e.length;
    }
  while (i !== -1);
  return o.push(t.slice(n)), o;
}
const Tr = (t, e = {}) => {
  e.bracketedArray = e.bracketedArray !== !1;
  const r = /* @__PURE__ */ Object.create(null);
  let n = r, i = null;
  const o = /^\[([^\]]*)\]\s*$|^([^=]+)(=(.*))?$/i, a = t.split(/[\r\n]+/g), s = {};
  for (const l of a) {
    if (!l || l.match(/^\s*[;#]/) || l.match(/^\s*$/))
      continue;
    const p = l.match(o);
    if (!p)
      continue;
    if (p[1] !== void 0) {
      if (i = it(p[1]), i === "__proto__") {
        n = /* @__PURE__ */ Object.create(null);
        continue;
      }
      n = r[i] = r[i] || /* @__PURE__ */ Object.create(null);
      continue;
    }
    const c = it(p[2]);
    let f;
    e.bracketedArray ? f = c.length > 2 && c.slice(-2) === "[]" : (s[c] = ((s == null ? void 0 : s[c]) || 0) + 1, f = s[c] > 1);
    const d = f ? c.slice(0, -2) : c;
    if (d === "__proto__")
      continue;
    const g = p[3] ? it(p[4]) : !0, S = g === "true" || g === "false" || g === "null" ? JSON.parse(g) : g;
    f && (Ot.call(n, d) ? Array.isArray(n[d]) || (n[d] = [n[d]]) : n[d] = []), Array.isArray(n[d]) ? n[d].push(S) : n[d] = S;
  }
  const u = [];
  for (const l of Object.keys(r)) {
    if (!Ot.call(r, l) || typeof r[l] != "object" || Array.isArray(r[l]))
      continue;
    const p = Tn(l, ".");
    n = r;
    const c = p.pop(), f = c.replace(/\\\./g, ".");
    for (const d of p)
      d !== "__proto__" && ((!Ot.call(n, d) || typeof n[d] != "object") && (n[d] = /* @__PURE__ */ Object.create(null)), n = n[d]);
    n === r && f === c || (n[f] = r[l], u.push(l));
  }
  for (const l of u)
    delete r[l];
  return r;
}, Rn = (t) => t.startsWith('"') && t.endsWith('"') || t.startsWith("'") && t.endsWith("'"), me = (t) => typeof t != "string" || t.match(/[=\r\n]/) || t.match(/^\[/) || t.length > 1 && Rn(t) || t !== t.trim() ? JSON.stringify(t) : t.split(";").join("\\;").split("#").join("\\#"), it = (t) => {
  if (t = (t || "").trim(), Rn(t)) {
    t.charAt(0) === "'" && (t = t.slice(1, -1));
    try {
      t = JSON.parse(t);
    } catch {
    }
  } else {
    let e = !1, r = "";
    for (let n = 0, i = t.length; n < i; n++) {
      const o = t.charAt(n);
      if (e)
        "\\;#".indexOf(o) !== -1 ? r += o : r += "\\" + o, e = !1;
      else {
        if (";#".indexOf(o) !== -1)
          break;
        o === "\\" ? e = !0 : r += o;
      }
    }
    return e && (r += "\\"), r.trim();
  }
  return t;
};
var Rr = {
  parse: Tr,
  decode: Tr,
  stringify: Vt,
  encode: Vt,
  safe: me,
  unsafe: it
};
async function Jl(t, e) {
  const r = Rr.parse(await t.readFileAsText(Or));
  for (const [n, i] of Object.entries(e))
    i == null ? delete r[n] : r[n] = i;
  await t.writeFile(Or, Rr.stringify(r));
}
ReadableStream.prototype[Symbol.asyncIterator] || (ReadableStream.prototype[Symbol.asyncIterator] = async function* () {
  const t = this.getReader();
  try {
    for (; ; ) {
      const { done: e, value: r } = await t.read();
      if (e)
        return;
      yield r;
    }
  } finally {
    t.releaseLock();
  }
}, ReadableStream.prototype.iterate = // @ts-ignore
ReadableStream.prototype[Symbol.asyncIterator]);
const ur = [
  "8.3",
  "8.2",
  "8.1",
  "8.0",
  "7.4",
  "7.3",
  "7.2",
  "7.1",
  "7.0"
], vo = ur[0], Kl = ur, kn = [
  "iconv",
  "mbstring",
  "xml-bundle",
  "gd"
], kr = {
  "kitchen-sink": kn,
  light: []
}, bo = [
  "vfs",
  "literal",
  "wordpress.org/themes",
  "wordpress.org/plugins",
  "url"
];
function $o(t) {
  return t && typeof t == "object" && typeof t.resource == "string" && bo.includes(t.resource);
}
class Te {
  /**
   * Creates a new Resource based on the given file reference
   *
   * @param ref The file reference to create the Resource for
   * @param options Additional options for the Resource
   * @returns A new Resource instance
   */
  static create(e, { semaphore: r, progress: n }) {
    let i;
    switch (e.resource) {
      case "vfs":
        i = new Eo(e, n);
        break;
      case "literal":
        i = new _o(e, n);
        break;
      case "wordpress.org/themes":
        i = new Ao(e, n);
        break;
      case "wordpress.org/plugins":
        i = new Fo(e, n);
        break;
      case "url":
        i = new So(e, n);
        break;
      default:
        throw new Error(`Invalid resource: ${e}`);
    }
    return i = new xo(i), r && (i = new Oo(i, r)), i;
  }
  setPlayground(e) {
    this.playground = e;
  }
  /** Whether this Resource is loaded asynchronously */
  get isAsync() {
    return !1;
  }
}
class Eo extends Te {
  /**
   * Creates a new instance of `VFSResource`.
   * @param playground The playground client.
   * @param resource The VFS reference.
   * @param progress The progress tracker.
   */
  constructor(e, r) {
    super(), this.resource = e, this.progress = r;
  }
  /** @inheritDoc */
  async resolve() {
    var r;
    const e = await this.playground.readFileAsBuffer(
      this.resource.path
    );
    return (r = this.progress) == null || r.set(100), new File([e], this.name);
  }
  /** @inheritDoc */
  get name() {
    return this.resource.path.split("/").pop() || "";
  }
}
class _o extends Te {
  /**
   * Creates a new instance of `LiteralResource`.
   * @param resource The literal reference.
   * @param progress The progress tracker.
   */
  constructor(e, r) {
    super(), this.resource = e, this.progress = r;
  }
  /** @inheritDoc */
  async resolve() {
    var e;
    return (e = this.progress) == null || e.set(100), new File([this.resource.contents], this.resource.name);
  }
  /** @inheritDoc */
  get name() {
    return this.resource.name;
  }
}
class pr extends Te {
  /**
   * Creates a new instance of `FetchResource`.
   * @param progress The progress tracker.
   */
  constructor(e) {
    super(), this.progress = e;
  }
  /** @inheritDoc */
  async resolve() {
    var r, n;
    (r = this.progress) == null || r.setCaption(this.caption);
    const e = this.getURL();
    try {
      let i = await fetch(e);
      if (!i.ok)
        throw new Error(`Could not download "${e}"`);
      if (i = await co(
        i,
        ((n = this.progress) == null ? void 0 : n.loadingListener) ?? Po
      ), i.status !== 200)
        throw new Error(`Could not download "${e}"`);
      return new File([await i.blob()], this.name);
    } catch (i) {
      throw new Error(
        `Could not download "${e}".
				Check if the URL is correct and the server is reachable.
				If it is reachable, the server might be blocking the request.
				Check the browser console and network tabs for more information.

				## Does the console show the error "No 'Access-Control-Allow-Origin' header"?

				This means the server that hosts your file does not allow requests from other sites
				(cross-origin requests, or CORS).	You need to move the asset to a server that allows
				cross-origin file downloads. Learn more about CORS at
				https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS.

				If your file is on GitHub, load it from "raw.githubusercontent.com".
				Here's how to do that:

				1. Start with the original GitHub URL of the file. For example:
				https://github.com/username/repository/blob/branch/filename.
				2. Replace "github.com" with "raw.githubusercontent.com".
				3. Remove the "/blob/" part of the URL.

				The resulting URL should look like this:
				https://raw.githubusercontent.com/username/repository/branch/filename

				Error:
				${i}`
      );
    }
  }
  /**
   * Gets the caption for the progress tracker.
   * @returns The caption.
   */
  get caption() {
    return `Downloading ${this.name}`;
  }
  /** @inheritDoc */
  get name() {
    try {
      return new URL(this.getURL(), "http://example.com").pathname.split("/").pop();
    } catch {
      return this.getURL();
    }
  }
  /** @inheritDoc */
  get isAsync() {
    return !0;
  }
}
const Po = () => {
};
class So extends pr {
  /**
   * Creates a new instance of `UrlResource`.
   * @param resource The URL reference.
   * @param progress The progress tracker.
   */
  constructor(e, r) {
    super(r), this.resource = e;
  }
  /** @inheritDoc */
  getURL() {
    return this.resource.url;
  }
  /** @inheritDoc */
  get caption() {
    return this.resource.caption ?? super.caption;
  }
}
class Ao extends pr {
  constructor(e, r) {
    super(r), this.resource = e;
  }
  get name() {
    return $t(this.resource.slug);
  }
  getURL() {
    return `https://downloads.wordpress.org/theme/${Cn(this.resource.slug)}`;
  }
}
class Fo extends pr {
  constructor(e, r) {
    super(r), this.resource = e;
  }
  /** @inheritDoc */
  get name() {
    return $t(this.resource.slug);
  }
  /** @inheritDoc */
  getURL() {
    return `https://downloads.wordpress.org/plugin/${Cn(this.resource.slug)}`;
  }
}
function Cn(t) {
  return !t || t.endsWith(".zip") ? t : t + ".latest-stable.zip";
}
class In extends Te {
  constructor(e) {
    super(), this.resource = e;
  }
  /** @inheritDoc */
  async resolve() {
    return this.resource.resolve();
  }
  /** @inheritDoc */
  async setPlayground(e) {
    return this.resource.setPlayground(e);
  }
  /** @inheritDoc */
  get progress() {
    return this.resource.progress;
  }
  /** @inheritDoc */
  set progress(e) {
    this.resource.progress = e;
  }
  /** @inheritDoc */
  get name() {
    return this.resource.name;
  }
  /** @inheritDoc */
  get isAsync() {
    return this.resource.isAsync;
  }
}
class xo extends In {
  /** @inheritDoc */
  async resolve() {
    return this.promise || (this.promise = super.resolve()), this.promise;
  }
}
class Oo extends In {
  constructor(e, r) {
    super(e), this.semaphore = r;
  }
  /** @inheritDoc */
  async resolve() {
    return this.isAsync ? this.semaphore.run(() => super.resolve()) : super.resolve();
  }
}
const To = "http://json-schema.org/schema", Ro = "#/definitions/Blueprint", ko = {
  Blueprint: {
    type: "object",
    properties: {
      landingPage: {
        type: "string",
        description: "The URL to navigate to after the blueprint has been run."
      },
      description: {
        type: "string",
        description: "Optional description. It doesn't do anything but is exposed as a courtesy to developers who may want to document which blueprint file does what.",
        deprecated: "Use meta.description instead."
      },
      meta: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "A clear and concise name for your Blueprint."
          },
          description: {
            type: "string",
            description: "A brief explanation of what your Blueprint offers."
          },
          author: {
            type: "string",
            description: "A GitHub username of the author of this Blueprint."
          },
          categories: {
            type: "array",
            items: {
              type: "string"
            },
            description: "Relevant categories to help users find your Blueprint in the future Blueprints section on WordPress.org."
          }
        },
        required: [
          "title",
          "author"
        ],
        additionalProperties: !1,
        description: "Optional metadata. Used by the Blueprints gallery at https://github.com/WordPress/blueprints"
      },
      preferredVersions: {
        type: "object",
        properties: {
          php: {
            anyOf: [
              {
                $ref: "#/definitions/SupportedPHPVersion"
              },
              {
                type: "string",
                const: "latest"
              }
            ],
            description: "The preferred PHP version to use. If not specified, the latest supported version will be used"
          },
          wp: {
            type: "string",
            description: "The preferred WordPress version to use. If not specified, the latest supported version will be used"
          }
        },
        required: [
          "php",
          "wp"
        ],
        additionalProperties: !1,
        description: "The preferred PHP and WordPress versions to use."
      },
      features: {
        type: "object",
        properties: {
          networking: {
            type: "boolean",
            description: "Should boot with support for network request via wp_safe_remote_get?"
          }
        },
        additionalProperties: !1
      },
      constants: {
        type: "object",
        additionalProperties: {
          type: "string"
        },
        description: "PHP Constants to define on every request"
      },
      plugins: {
        type: "array",
        items: {
          anyOf: [
            {
              type: "string"
            },
            {
              $ref: "#/definitions/FileReference"
            }
          ]
        },
        description: "WordPress plugins to install and activate"
      },
      siteOptions: {
        type: "object",
        additionalProperties: {
          type: "string"
        },
        properties: {
          blogname: {
            type: "string",
            description: "The site title"
          }
        },
        description: "WordPress site options to define"
      },
      login: {
        anyOf: [
          {
            type: "boolean"
          },
          {
            type: "object",
            properties: {
              username: {
                type: "string"
              },
              password: {
                type: "string"
              }
            },
            required: [
              "username",
              "password"
            ],
            additionalProperties: !1
          }
        ],
        description: "User to log in as. If true, logs the user in as admin/password."
      },
      phpExtensionBundles: {
        type: "array",
        items: {
          $ref: "#/definitions/SupportedPHPExtensionBundle"
        },
        description: "The PHP extensions to use."
      },
      steps: {
        type: "array",
        items: {
          anyOf: [
            {
              $ref: "#/definitions/StepDefinition"
            },
            {
              type: "string"
            },
            {
              not: {}
            },
            {
              type: "boolean",
              const: !1
            },
            {
              type: "null"
            }
          ]
        },
        description: "The steps to run after every other operation in this Blueprint was executed."
      },
      $schema: {
        type: "string"
      }
    },
    additionalProperties: !1
  },
  SupportedPHPVersion: {
    type: "string",
    enum: [
      "8.3",
      "8.2",
      "8.1",
      "8.0",
      "7.4",
      "7.3",
      "7.2",
      "7.1",
      "7.0"
    ]
  },
  FileReference: {
    anyOf: [
      {
        $ref: "#/definitions/VFSReference"
      },
      {
        $ref: "#/definitions/LiteralReference"
      },
      {
        $ref: "#/definitions/CoreThemeReference"
      },
      {
        $ref: "#/definitions/CorePluginReference"
      },
      {
        $ref: "#/definitions/UrlReference"
      }
    ]
  },
  VFSReference: {
    type: "object",
    properties: {
      resource: {
        type: "string",
        const: "vfs",
        description: "Identifies the file resource as Virtual File System (VFS)"
      },
      path: {
        type: "string",
        description: "The path to the file in the VFS"
      }
    },
    required: [
      "resource",
      "path"
    ],
    additionalProperties: !1
  },
  LiteralReference: {
    type: "object",
    properties: {
      resource: {
        type: "string",
        const: "literal",
        description: "Identifies the file resource as a literal file"
      },
      name: {
        type: "string",
        description: "The name of the file"
      },
      contents: {
        anyOf: [
          {
            type: "string"
          },
          {
            type: "object",
            properties: {
              BYTES_PER_ELEMENT: {
                type: "number"
              },
              buffer: {
                type: "object",
                properties: {
                  byteLength: {
                    type: "number"
                  }
                },
                required: [
                  "byteLength"
                ],
                additionalProperties: !1
              },
              byteLength: {
                type: "number"
              },
              byteOffset: {
                type: "number"
              },
              length: {
                type: "number"
              }
            },
            required: [
              "BYTES_PER_ELEMENT",
              "buffer",
              "byteLength",
              "byteOffset",
              "length"
            ],
            additionalProperties: {
              type: "number"
            }
          }
        ],
        description: "The contents of the file"
      }
    },
    required: [
      "resource",
      "name",
      "contents"
    ],
    additionalProperties: !1
  },
  CoreThemeReference: {
    type: "object",
    properties: {
      resource: {
        type: "string",
        const: "wordpress.org/themes",
        description: "Identifies the file resource as a WordPress Core theme"
      },
      slug: {
        type: "string",
        description: "The slug of the WordPress Core theme"
      }
    },
    required: [
      "resource",
      "slug"
    ],
    additionalProperties: !1
  },
  CorePluginReference: {
    type: "object",
    properties: {
      resource: {
        type: "string",
        const: "wordpress.org/plugins",
        description: "Identifies the file resource as a WordPress Core plugin"
      },
      slug: {
        type: "string",
        description: "The slug of the WordPress Core plugin"
      }
    },
    required: [
      "resource",
      "slug"
    ],
    additionalProperties: !1
  },
  UrlReference: {
    type: "object",
    properties: {
      resource: {
        type: "string",
        const: "url",
        description: "Identifies the file resource as a URL"
      },
      url: {
        type: "string",
        description: "The URL of the file"
      },
      caption: {
        type: "string",
        description: "Optional caption for displaying a progress message"
      }
    },
    required: [
      "resource",
      "url"
    ],
    additionalProperties: !1
  },
  SupportedPHPExtensionBundle: {
    type: "string",
    enum: [
      "kitchen-sink",
      "light"
    ]
  },
  StepDefinition: {
    type: "object",
    discriminator: {
      propertyName: "step"
    },
    required: [
      "step"
    ],
    oneOf: [
      {
        type: "object",
        additionalProperties: !1,
        properties: {
          progress: {
            type: "object",
            properties: {
              weight: {
                type: "number"
              },
              caption: {
                type: "string"
              }
            },
            additionalProperties: !1
          },
          step: {
            type: "string",
            const: "activatePlugin"
          },
          pluginPath: {
            type: "string",
            description: "Path to the plugin directory as absolute path (/wordpress/wp-content/plugins/plugin-name); or the plugin entry file relative to the plugins directory (plugin-name/plugin-name.php)."
          },
          pluginName: {
            type: "string",
            description: "Optional. Plugin name to display in the progress bar."
          }
        },
        required: [
          "pluginPath",
          "step"
        ]
      },
      {
        type: "object",
        additionalProperties: !1,
        properties: {
          progress: {
            type: "object",
            properties: {
              weight: {
                type: "number"
              },
              caption: {
                type: "string"
              }
            },
            additionalProperties: !1
          },
          step: {
            type: "string",
            const: "activateTheme"
          },
          themeFolderName: {
            type: "string",
            description: "The name of the theme folder inside wp-content/themes/"
          }
        },
        required: [
          "step",
          "themeFolderName"
        ]
      },
      {
        type: "object",
        additionalProperties: !1,
        properties: {
          progress: {
            type: "object",
            properties: {
              weight: {
                type: "number"
              },
              caption: {
                type: "string"
              }
            },
            additionalProperties: !1
          },
          step: {
            type: "string",
            const: "cp"
          },
          fromPath: {
            type: "string",
            description: "Source path"
          },
          toPath: {
            type: "string",
            description: "Target path"
          }
        },
        required: [
          "fromPath",
          "step",
          "toPath"
        ]
      },
      {
        type: "object",
        additionalProperties: !1,
        properties: {
          progress: {
            type: "object",
            properties: {
              weight: {
                type: "number"
              },
              caption: {
                type: "string"
              }
            },
            additionalProperties: !1
          },
          step: {
            type: "string",
            const: "defineWpConfigConsts"
          },
          consts: {
            type: "object",
            additionalProperties: {},
            description: "The constants to define"
          },
          method: {
            type: "string",
            enum: [
              "rewrite-wp-config",
              "define-before-run"
            ],
            description: `The method of defining the constants in wp-config.php. Possible values are:

- rewrite-wp-config: Default. Rewrites the wp-config.php file to                      explicitly call define() with the requested                      name and value. This method alters the file                      on the disk, but it doesn't conflict with                      existing define() calls in wp-config.php.

- define-before-run: Defines the constant before running the requested                      script. It doesn't alter any files on the disk, but                      constants defined this way may conflict with existing                      define() calls in wp-config.php.`
          },
          virtualize: {
            type: "boolean",
            deprecated: `This option is noop and will be removed in a future version.
This option is only kept in here to avoid breaking Blueprint schema validation
for existing apps using this option.`
          }
        },
        required: [
          "consts",
          "step"
        ]
      },
      {
        type: "object",
        additionalProperties: !1,
        properties: {
          progress: {
            type: "object",
            properties: {
              weight: {
                type: "number"
              },
              caption: {
                type: "string"
              }
            },
            additionalProperties: !1
          },
          step: {
            type: "string",
            const: "defineSiteUrl"
          },
          siteUrl: {
            type: "string",
            description: "The URL"
          }
        },
        required: [
          "siteUrl",
          "step"
        ]
      },
      {
        type: "object",
        additionalProperties: !1,
        properties: {
          progress: {
            type: "object",
            properties: {
              weight: {
                type: "number"
              },
              caption: {
                type: "string"
              }
            },
            additionalProperties: !1
          },
          step: {
            type: "string",
            const: "enableMultisite"
          }
        },
        required: [
          "step"
        ]
      },
      {
        type: "object",
        additionalProperties: !1,
        properties: {
          progress: {
            type: "object",
            properties: {
              weight: {
                type: "number"
              },
              caption: {
                type: "string"
              }
            },
            additionalProperties: !1
          },
          step: {
            type: "string",
            const: "importWxr"
          },
          file: {
            $ref: "#/definitions/FileReference",
            description: "The file to import"
          }
        },
        required: [
          "file",
          "step"
        ]
      },
      {
        type: "object",
        additionalProperties: !1,
        properties: {
          progress: {
            type: "object",
            properties: {
              weight: {
                type: "number"
              },
              caption: {
                type: "string"
              }
            },
            additionalProperties: !1
          },
          step: {
            type: "string",
            const: "importThemeStarterContent",
            description: "The step identifier."
          },
          themeSlug: {
            type: "string",
            description: "The name of the theme to import content from."
          }
        },
        required: [
          "step"
        ]
      },
      {
        type: "object",
        additionalProperties: !1,
        properties: {
          progress: {
            type: "object",
            properties: {
              weight: {
                type: "number"
              },
              caption: {
                type: "string"
              }
            },
            additionalProperties: !1
          },
          step: {
            type: "string",
            const: "importWordPressFiles"
          },
          wordPressFilesZip: {
            $ref: "#/definitions/FileReference",
            description: "The zip file containing the top-level WordPress files and directories."
          },
          pathInZip: {
            type: "string",
            description: "The path inside the zip file where the WordPress files are."
          }
        },
        required: [
          "step",
          "wordPressFilesZip"
        ]
      },
      {
        type: "object",
        additionalProperties: !1,
        properties: {
          progress: {
            type: "object",
            properties: {
              weight: {
                type: "number"
              },
              caption: {
                type: "string"
              }
            },
            additionalProperties: !1
          },
          ifAlreadyInstalled: {
            type: "string",
            enum: [
              "overwrite",
              "skip",
              "error"
            ],
            description: "What to do if the asset already exists."
          },
          step: {
            type: "string",
            const: "installPlugin",
            description: "The step identifier."
          },
          pluginZipFile: {
            $ref: "#/definitions/FileReference",
            description: "The plugin zip file to install."
          },
          options: {
            $ref: "#/definitions/InstallPluginOptions",
            description: "Optional installation options."
          }
        },
        required: [
          "pluginZipFile",
          "step"
        ]
      },
      {
        type: "object",
        additionalProperties: !1,
        properties: {
          progress: {
            type: "object",
            properties: {
              weight: {
                type: "number"
              },
              caption: {
                type: "string"
              }
            },
            additionalProperties: !1
          },
          ifAlreadyInstalled: {
            type: "string",
            enum: [
              "overwrite",
              "skip",
              "error"
            ],
            description: "What to do if the asset already exists."
          },
          step: {
            type: "string",
            const: "installTheme",
            description: "The step identifier."
          },
          themeZipFile: {
            $ref: "#/definitions/FileReference",
            description: "The theme zip file to install."
          },
          options: {
            type: "object",
            properties: {
              activate: {
                type: "boolean",
                description: "Whether to activate the theme after installing it."
              },
              importStarterContent: {
                type: "boolean",
                description: "Whether to import the theme's starter content after installing it."
              }
            },
            additionalProperties: !1,
            description: "Optional installation options."
          }
        },
        required: [
          "step",
          "themeZipFile"
        ]
      },
      {
        type: "object",
        additionalProperties: !1,
        properties: {
          progress: {
            type: "object",
            properties: {
              weight: {
                type: "number"
              },
              caption: {
                type: "string"
              }
            },
            additionalProperties: !1
          },
          step: {
            type: "string",
            const: "login"
          },
          username: {
            type: "string",
            description: "The user to log in as. Defaults to 'admin'."
          },
          password: {
            type: "string",
            description: "The password to log in with. Defaults to 'password'."
          }
        },
        required: [
          "step"
        ]
      },
      {
        type: "object",
        additionalProperties: !1,
        properties: {
          progress: {
            type: "object",
            properties: {
              weight: {
                type: "number"
              },
              caption: {
                type: "string"
              }
            },
            additionalProperties: !1
          },
          step: {
            type: "string",
            const: "mkdir"
          },
          path: {
            type: "string",
            description: "The path of the directory you want to create"
          }
        },
        required: [
          "path",
          "step"
        ]
      },
      {
        type: "object",
        additionalProperties: !1,
        properties: {
          progress: {
            type: "object",
            properties: {
              weight: {
                type: "number"
              },
              caption: {
                type: "string"
              }
            },
            additionalProperties: !1
          },
          step: {
            type: "string",
            const: "mv"
          },
          fromPath: {
            type: "string",
            description: "Source path"
          },
          toPath: {
            type: "string",
            description: "Target path"
          }
        },
        required: [
          "fromPath",
          "step",
          "toPath"
        ]
      },
      {
        type: "object",
        additionalProperties: !1,
        properties: {
          progress: {
            type: "object",
            properties: {
              weight: {
                type: "number"
              },
              caption: {
                type: "string"
              }
            },
            additionalProperties: !1
          },
          step: {
            type: "string",
            const: "resetData"
          }
        },
        required: [
          "step"
        ]
      },
      {
        type: "object",
        additionalProperties: !1,
        properties: {
          progress: {
            type: "object",
            properties: {
              weight: {
                type: "number"
              },
              caption: {
                type: "string"
              }
            },
            additionalProperties: !1
          },
          step: {
            type: "string",
            const: "request"
          },
          request: {
            $ref: "#/definitions/PHPRequest",
            description: "Request details (See /wordpress-playground/api/universal/interface/PHPRequest)"
          }
        },
        required: [
          "request",
          "step"
        ]
      },
      {
        type: "object",
        additionalProperties: !1,
        properties: {
          progress: {
            type: "object",
            properties: {
              weight: {
                type: "number"
              },
              caption: {
                type: "string"
              }
            },
            additionalProperties: !1
          },
          step: {
            type: "string",
            const: "rm"
          },
          path: {
            type: "string",
            description: "The path to remove"
          }
        },
        required: [
          "path",
          "step"
        ]
      },
      {
        type: "object",
        additionalProperties: !1,
        properties: {
          progress: {
            type: "object",
            properties: {
              weight: {
                type: "number"
              },
              caption: {
                type: "string"
              }
            },
            additionalProperties: !1
          },
          step: {
            type: "string",
            const: "rmdir"
          },
          path: {
            type: "string",
            description: "The path to remove"
          }
        },
        required: [
          "path",
          "step"
        ]
      },
      {
        type: "object",
        additionalProperties: !1,
        properties: {
          progress: {
            type: "object",
            properties: {
              weight: {
                type: "number"
              },
              caption: {
                type: "string"
              }
            },
            additionalProperties: !1
          },
          step: {
            type: "string",
            const: "runPHP",
            description: "The step identifier."
          },
          code: {
            type: "string",
            description: "The PHP code to run."
          }
        },
        required: [
          "code",
          "step"
        ]
      },
      {
        type: "object",
        additionalProperties: !1,
        properties: {
          progress: {
            type: "object",
            properties: {
              weight: {
                type: "number"
              },
              caption: {
                type: "string"
              }
            },
            additionalProperties: !1
          },
          step: {
            type: "string",
            const: "runPHPWithOptions"
          },
          options: {
            $ref: "#/definitions/PHPRunOptions",
            description: "Run options (See /wordpress-playground/api/universal/interface/PHPRunOptions/))"
          }
        },
        required: [
          "options",
          "step"
        ]
      },
      {
        type: "object",
        additionalProperties: !1,
        properties: {
          progress: {
            type: "object",
            properties: {
              weight: {
                type: "number"
              },
              caption: {
                type: "string"
              }
            },
            additionalProperties: !1
          },
          step: {
            type: "string",
            const: "runWpInstallationWizard"
          },
          options: {
            $ref: "#/definitions/WordPressInstallationOptions"
          }
        },
        required: [
          "options",
          "step"
        ]
      },
      {
        type: "object",
        additionalProperties: !1,
        properties: {
          progress: {
            type: "object",
            properties: {
              weight: {
                type: "number"
              },
              caption: {
                type: "string"
              }
            },
            additionalProperties: !1
          },
          step: {
            type: "string",
            const: "runSql",
            description: "The step identifier."
          },
          sql: {
            $ref: "#/definitions/FileReference",
            description: "The SQL to run. Each non-empty line must contain a valid SQL query."
          }
        },
        required: [
          "sql",
          "step"
        ]
      },
      {
        type: "object",
        additionalProperties: !1,
        properties: {
          progress: {
            type: "object",
            properties: {
              weight: {
                type: "number"
              },
              caption: {
                type: "string"
              }
            },
            additionalProperties: !1
          },
          step: {
            type: "string",
            const: "setSiteOptions",
            description: 'The name of the step. Must be "setSiteOptions".'
          },
          options: {
            type: "object",
            additionalProperties: {},
            description: "The options to set on the site."
          }
        },
        required: [
          "options",
          "step"
        ]
      },
      {
        type: "object",
        additionalProperties: !1,
        properties: {
          progress: {
            type: "object",
            properties: {
              weight: {
                type: "number"
              },
              caption: {
                type: "string"
              }
            },
            additionalProperties: !1
          },
          step: {
            type: "string",
            const: "unzip"
          },
          zipFile: {
            $ref: "#/definitions/FileReference",
            description: "The zip file to extract"
          },
          zipPath: {
            type: "string",
            description: "The path of the zip file to extract",
            deprecated: "Use zipFile instead."
          },
          extractToPath: {
            type: "string",
            description: "The path to extract the zip file to"
          }
        },
        required: [
          "extractToPath",
          "step"
        ]
      },
      {
        type: "object",
        additionalProperties: !1,
        properties: {
          progress: {
            type: "object",
            properties: {
              weight: {
                type: "number"
              },
              caption: {
                type: "string"
              }
            },
            additionalProperties: !1
          },
          step: {
            type: "string",
            const: "updateUserMeta"
          },
          meta: {
            type: "object",
            additionalProperties: {},
            description: 'An object of user meta values to set, e.g. { "first_name": "John" }'
          },
          userId: {
            type: "number",
            description: "User ID"
          }
        },
        required: [
          "meta",
          "step",
          "userId"
        ]
      },
      {
        type: "object",
        additionalProperties: !1,
        properties: {
          progress: {
            type: "object",
            properties: {
              weight: {
                type: "number"
              },
              caption: {
                type: "string"
              }
            },
            additionalProperties: !1
          },
          step: {
            type: "string",
            const: "writeFile"
          },
          path: {
            type: "string",
            description: "The path of the file to write to"
          },
          data: {
            anyOf: [
              {
                $ref: "#/definitions/FileReference"
              },
              {
                type: "string"
              },
              {
                type: "object",
                properties: {
                  BYTES_PER_ELEMENT: {
                    type: "number"
                  },
                  buffer: {
                    type: "object",
                    properties: {
                      byteLength: {
                        type: "number"
                      }
                    },
                    required: [
                      "byteLength"
                    ],
                    additionalProperties: !1
                  },
                  byteLength: {
                    type: "number"
                  },
                  byteOffset: {
                    type: "number"
                  },
                  length: {
                    type: "number"
                  }
                },
                required: [
                  "BYTES_PER_ELEMENT",
                  "buffer",
                  "byteLength",
                  "byteOffset",
                  "length"
                ],
                additionalProperties: {
                  type: "number"
                }
              }
            ],
            description: "The data to write"
          }
        },
        required: [
          "data",
          "path",
          "step"
        ]
      },
      {
        type: "object",
        additionalProperties: !1,
        properties: {
          progress: {
            type: "object",
            properties: {
              weight: {
                type: "number"
              },
              caption: {
                type: "string"
              }
            },
            additionalProperties: !1
          },
          step: {
            type: "string",
            const: "wp-cli",
            description: "The step identifier."
          },
          command: {
            anyOf: [
              {
                type: "string"
              },
              {
                type: "array",
                items: {
                  type: "string"
                }
              }
            ],
            description: "The WP CLI command to run."
          },
          wpCliPath: {
            type: "string",
            description: "wp-cli.phar path"
          }
        },
        required: [
          "command",
          "step"
        ]
      },
      {
        type: "object",
        additionalProperties: !1,
        properties: {
          progress: {
            type: "object",
            properties: {
              weight: {
                type: "number"
              },
              caption: {
                type: "string"
              }
            },
            additionalProperties: !1
          },
          step: {
            type: "string",
            const: "setSiteLanguage"
          },
          language: {
            type: "string",
            description: "The language to set, e.g. 'en_US'"
          }
        },
        required: [
          "language",
          "step"
        ]
      }
    ]
  },
  InstallPluginOptions: {
    type: "object",
    properties: {
      activate: {
        type: "boolean",
        description: "Whether to activate the plugin after installing it."
      }
    },
    additionalProperties: !1
  },
  PHPRequest: {
    type: "object",
    properties: {
      method: {
        $ref: "#/definitions/HTTPMethod",
        description: "Request method. Default: `GET`."
      },
      url: {
        type: "string",
        description: "Request path or absolute URL."
      },
      headers: {
        $ref: "#/definitions/PHPRequestHeaders",
        description: "Request headers."
      },
      body: {
        anyOf: [
          {
            type: "string"
          },
          {
            type: "object",
            properties: {
              BYTES_PER_ELEMENT: {
                type: "number"
              },
              buffer: {
                type: "object",
                properties: {
                  byteLength: {
                    type: "number"
                  }
                },
                required: [
                  "byteLength"
                ],
                additionalProperties: !1
              },
              byteLength: {
                type: "number"
              },
              byteOffset: {
                type: "number"
              },
              length: {
                type: "number"
              }
            },
            required: [
              "BYTES_PER_ELEMENT",
              "buffer",
              "byteLength",
              "byteOffset",
              "length"
            ],
            additionalProperties: {
              type: "number"
            }
          },
          {
            type: "object",
            additionalProperties: {
              anyOf: [
                {
                  type: "string"
                },
                {
                  type: "object",
                  properties: {
                    BYTES_PER_ELEMENT: {
                      type: "number"
                    },
                    buffer: {
                      type: "object",
                      properties: {
                        byteLength: {
                          type: "number"
                        }
                      },
                      required: [
                        "byteLength"
                      ],
                      additionalProperties: !1
                    },
                    byteLength: {
                      type: "number"
                    },
                    byteOffset: {
                      type: "number"
                    },
                    length: {
                      type: "number"
                    }
                  },
                  required: [
                    "BYTES_PER_ELEMENT",
                    "buffer",
                    "byteLength",
                    "byteOffset",
                    "length"
                  ],
                  additionalProperties: {
                    type: "number"
                  }
                },
                {
                  type: "object",
                  properties: {
                    size: {
                      type: "number"
                    },
                    type: {
                      type: "string"
                    },
                    lastModified: {
                      type: "number"
                    },
                    name: {
                      type: "string"
                    },
                    webkitRelativePath: {
                      type: "string"
                    }
                  },
                  required: [
                    "lastModified",
                    "name",
                    "size",
                    "type",
                    "webkitRelativePath"
                  ],
                  additionalProperties: !1
                }
              ]
            }
          }
        ],
        description: "Request body. If an object is given, the request will be encoded as multipart and sent with a `multipart/form-data` header."
      }
    },
    required: [
      "url"
    ],
    additionalProperties: !1
  },
  HTTPMethod: {
    type: "string",
    enum: [
      "GET",
      "POST",
      "HEAD",
      "OPTIONS",
      "PATCH",
      "PUT",
      "DELETE"
    ]
  },
  PHPRequestHeaders: {
    type: "object",
    additionalProperties: {
      type: "string"
    }
  },
  PHPRunOptions: {
    type: "object",
    properties: {
      relativeUri: {
        type: "string",
        description: "Request path following the domain:port part."
      },
      scriptPath: {
        type: "string",
        description: "Path of the .php file to execute."
      },
      protocol: {
        type: "string",
        description: "Request protocol."
      },
      method: {
        $ref: "#/definitions/HTTPMethod",
        description: "Request method. Default: `GET`."
      },
      headers: {
        $ref: "#/definitions/PHPRequestHeaders",
        description: "Request headers."
      },
      body: {
        anyOf: [
          {
            type: "string"
          },
          {
            type: "object",
            properties: {
              BYTES_PER_ELEMENT: {
                type: "number"
              },
              buffer: {
                type: "object",
                properties: {
                  byteLength: {
                    type: "number"
                  }
                },
                required: [
                  "byteLength"
                ],
                additionalProperties: !1
              },
              byteLength: {
                type: "number"
              },
              byteOffset: {
                type: "number"
              },
              length: {
                type: "number"
              }
            },
            required: [
              "BYTES_PER_ELEMENT",
              "buffer",
              "byteLength",
              "byteOffset",
              "length"
            ],
            additionalProperties: {
              type: "number"
            }
          }
        ],
        description: "Request body."
      },
      env: {
        type: "object",
        additionalProperties: {
          type: "string"
        },
        description: "Environment variables to set for this run."
      },
      $_SERVER: {
        type: "object",
        additionalProperties: {
          type: "string"
        },
        description: "$_SERVER entries to set for this run."
      },
      code: {
        type: "string",
        description: "The code snippet to eval instead of a php file."
      }
    },
    additionalProperties: !1
  },
  WordPressInstallationOptions: {
    type: "object",
    properties: {
      adminUsername: {
        type: "string"
      },
      adminPassword: {
        type: "string"
      }
    },
    additionalProperties: !1
  }
}, Co = {
  $schema: To,
  $ref: Ro,
  definitions: ko
};
var $e = {}, ct = { exports: {} };
/*! https://mths.be/punycode v1.4.1 by @mathias */
ct.exports;
(function(t, e) {
  (function(r) {
    var n = e && !e.nodeType && e, i = t && !t.nodeType && t, o = typeof Ze == "object" && Ze;
    (o.global === o || o.window === o || o.self === o) && (r = o);
    var a, s = 2147483647, u = 36, l = 1, p = 26, c = 38, f = 700, d = 72, g = 128, S = "-", b = /^xn--/, D = /[^\x20-\x7E]/, h = /[\x2E\u3002\uFF0E\uFF61]/g, y = {
      overflow: "Overflow: input needs wider integers to process",
      "not-basic": "Illegal input >= 0x80 (not a basic code point)",
      "invalid-input": "Invalid input"
    }, E = u - l, $ = Math.floor, A = String.fromCharCode, H;
    function O(m) {
      throw new RangeError(y[m]);
    }
    function T(m, w) {
      for (var F = m.length, x = []; F--; )
        x[F] = w(m[F]);
      return x;
    }
    function N(m, w) {
      var F = m.split("@"), x = "";
      F.length > 1 && (x = F[0] + "@", m = F[1]), m = m.replace(h, ".");
      var R = m.split("."), Q = T(R, w).join(".");
      return x + Q;
    }
    function re(m) {
      for (var w = [], F = 0, x = m.length, R, Q; F < x; )
        R = m.charCodeAt(F++), R >= 55296 && R <= 56319 && F < x ? (Q = m.charCodeAt(F++), (Q & 64512) == 56320 ? w.push(((R & 1023) << 10) + (Q & 1023) + 65536) : (w.push(R), F--)) : w.push(R);
      return w;
    }
    function ne(m) {
      return T(m, function(w) {
        var F = "";
        return w > 65535 && (w -= 65536, F += A(w >>> 10 & 1023 | 55296), w = 56320 | w & 1023), F += A(w), F;
      }).join("");
    }
    function z(m) {
      return m - 48 < 10 ? m - 22 : m - 65 < 26 ? m - 65 : m - 97 < 26 ? m - 97 : u;
    }
    function V(m, w) {
      return m + 22 + 75 * (m < 26) - ((w != 0) << 5);
    }
    function G(m, w, F) {
      var x = 0;
      for (m = F ? $(m / f) : m >> 1, m += $(m / w); m > E * p >> 1; x += u)
        m = $(m / E);
      return $(x + (E + 1) * m / (m + c));
    }
    function J(m) {
      var w = [], F = m.length, x, R = 0, Q = g, B = d, K, ie, se, ye, U, ee, oe, we, Pe;
      for (K = m.lastIndexOf(S), K < 0 && (K = 0), ie = 0; ie < K; ++ie)
        m.charCodeAt(ie) >= 128 && O("not-basic"), w.push(m.charCodeAt(ie));
      for (se = K > 0 ? K + 1 : 0; se < F; ) {
        for (ye = R, U = 1, ee = u; se >= F && O("invalid-input"), oe = z(m.charCodeAt(se++)), (oe >= u || oe > $((s - R) / U)) && O("overflow"), R += oe * U, we = ee <= B ? l : ee >= B + p ? p : ee - B, !(oe < we); ee += u)
          Pe = u - we, U > $(s / Pe) && O("overflow"), U *= Pe;
        x = w.length + 1, B = G(R - ye, x, ye == 0), $(R / x) > s - Q && O("overflow"), Q += $(R / x), R %= x, w.splice(R++, 0, Q);
      }
      return ne(w);
    }
    function ge(m) {
      var w, F, x, R, Q, B, K, ie, se, ye, U, ee = [], oe, we, Pe, St;
      for (m = re(m), oe = m.length, w = g, F = 0, Q = d, B = 0; B < oe; ++B)
        U = m[B], U < 128 && ee.push(A(U));
      for (x = R = ee.length, R && ee.push(S); x < oe; ) {
        for (K = s, B = 0; B < oe; ++B)
          U = m[B], U >= w && U < K && (K = U);
        for (we = x + 1, K - w > $((s - F) / we) && O("overflow"), F += (K - w) * we, w = K, B = 0; B < oe; ++B)
          if (U = m[B], U < w && ++F > s && O("overflow"), U == w) {
            for (ie = F, se = u; ye = se <= Q ? l : se >= Q + p ? p : se - Q, !(ie < ye); se += u)
              St = ie - ye, Pe = u - ye, ee.push(
                A(V(ye + St % Pe, 0))
              ), ie = $(St / Pe);
            ee.push(A(V(ie, 0))), Q = G(F, we, x == R), F = 0, ++x;
          }
        ++F, ++w;
      }
      return ee.join("");
    }
    function Pt(m) {
      return N(m, function(w) {
        return b.test(w) ? J(w.slice(4).toLowerCase()) : w;
      });
    }
    function Xe(m) {
      return N(m, function(w) {
        return D.test(w) ? "xn--" + ge(w) : w;
      });
    }
    if (a = {
      /**
       * A string representing the current Punycode.js version number.
       * @memberOf punycode
       * @type String
       */
      version: "1.4.1",
      /**
       * An object of methods to convert from JavaScript's internal character
       * representation (UCS-2) to Unicode code points, and back.
       * @see <https://mathiasbynens.be/notes/javascript-encoding>
       * @memberOf punycode
       * @type Object
       */
      ucs2: {
        decode: re,
        encode: ne
      },
      decode: J,
      encode: ge,
      toASCII: Xe,
      toUnicode: Pt
    }, n && i)
      if (t.exports == n)
        i.exports = a;
      else
        for (H in a)
          a.hasOwnProperty(H) && (n[H] = a[H]);
    else
      r.punycode = a;
  })(Ze);
})(ct, ct.exports);
var Io = ct.exports, Lo = Error, Do = EvalError, zo = RangeError, Mo = ReferenceError, Ln = SyntaxError, Je = TypeError, No = URIError, qo = function() {
  if (typeof Symbol != "function" || typeof Object.getOwnPropertySymbols != "function")
    return !1;
  if (typeof Symbol.iterator == "symbol")
    return !0;
  var e = {}, r = Symbol("test"), n = Object(r);
  if (typeof r == "string" || Object.prototype.toString.call(r) !== "[object Symbol]" || Object.prototype.toString.call(n) !== "[object Symbol]")
    return !1;
  var i = 42;
  e[r] = i;
  for (r in e)
    return !1;
  if (typeof Object.keys == "function" && Object.keys(e).length !== 0 || typeof Object.getOwnPropertyNames == "function" && Object.getOwnPropertyNames(e).length !== 0)
    return !1;
  var o = Object.getOwnPropertySymbols(e);
  if (o.length !== 1 || o[0] !== r || !Object.prototype.propertyIsEnumerable.call(e, r))
    return !1;
  if (typeof Object.getOwnPropertyDescriptor == "function") {
    var a = Object.getOwnPropertyDescriptor(e, r);
    if (a.value !== i || a.enumerable !== !0)
      return !1;
  }
  return !0;
}, Cr = typeof Symbol < "u" && Symbol, jo = qo, Wo = function() {
  return typeof Cr != "function" || typeof Symbol != "function" || typeof Cr("foo") != "symbol" || typeof Symbol("bar") != "symbol" ? !1 : jo();
}, Ir = {
  foo: {}
}, Bo = Object, Uo = function() {
  return { __proto__: Ir }.foo === Ir.foo && !({ __proto__: null } instanceof Bo);
}, Zo = "Function.prototype.bind called on incompatible ", Ho = Object.prototype.toString, Vo = Math.max, Go = "[object Function]", Lr = function(e, r) {
  for (var n = [], i = 0; i < e.length; i += 1)
    n[i] = e[i];
  for (var o = 0; o < r.length; o += 1)
    n[o + e.length] = r[o];
  return n;
}, Qo = function(e, r) {
  for (var n = [], i = r || 0, o = 0; i < e.length; i += 1, o += 1)
    n[o] = e[i];
  return n;
}, Jo = function(t, e) {
  for (var r = "", n = 0; n < t.length; n += 1)
    r += t[n], n + 1 < t.length && (r += e);
  return r;
}, Ko = function(e) {
  var r = this;
  if (typeof r != "function" || Ho.apply(r) !== Go)
    throw new TypeError(Zo + r);
  for (var n = Qo(arguments, 1), i, o = function() {
    if (this instanceof i) {
      var p = r.apply(
        this,
        Lr(n, arguments)
      );
      return Object(p) === p ? p : this;
    }
    return r.apply(
      e,
      Lr(n, arguments)
    );
  }, a = Vo(0, r.length - n.length), s = [], u = 0; u < a; u++)
    s[u] = "$" + u;
  if (i = Function("binder", "return function (" + Jo(s, ",") + "){ return binder.apply(this,arguments); }")(o), r.prototype) {
    var l = function() {
    };
    l.prototype = r.prototype, i.prototype = new l(), l.prototype = null;
  }
  return i;
}, Yo = Ko, fr = Function.prototype.bind || Yo, Xo = Function.prototype.call, ea = Object.prototype.hasOwnProperty, ta = fr, ra = ta.call(Xo, ea), v, na = Lo, ia = Do, oa = zo, aa = Mo, Ne = Ln, ze = Je, sa = No, Dn = Function, Tt = function(t) {
  try {
    return Dn('"use strict"; return (' + t + ").constructor;")();
  } catch {
  }
}, Fe = Object.getOwnPropertyDescriptor;
if (Fe)
  try {
    Fe({}, "");
  } catch {
    Fe = null;
  }
var Rt = function() {
  throw new ze();
}, la = Fe ? function() {
  try {
    return arguments.callee, Rt;
  } catch {
    try {
      return Fe(arguments, "callee").get;
    } catch {
      return Rt;
    }
  }
}() : Rt, ke = Wo(), ua = Uo(), q = Object.getPrototypeOf || (ua ? function(t) {
  return t.__proto__;
} : null), Ie = {}, pa = typeof Uint8Array > "u" || !q ? v : q(Uint8Array), xe = {
  __proto__: null,
  "%AggregateError%": typeof AggregateError > "u" ? v : AggregateError,
  "%Array%": Array,
  "%ArrayBuffer%": typeof ArrayBuffer > "u" ? v : ArrayBuffer,
  "%ArrayIteratorPrototype%": ke && q ? q([][Symbol.iterator]()) : v,
  "%AsyncFromSyncIteratorPrototype%": v,
  "%AsyncFunction%": Ie,
  "%AsyncGenerator%": Ie,
  "%AsyncGeneratorFunction%": Ie,
  "%AsyncIteratorPrototype%": Ie,
  "%Atomics%": typeof Atomics > "u" ? v : Atomics,
  "%BigInt%": typeof BigInt > "u" ? v : BigInt,
  "%BigInt64Array%": typeof BigInt64Array > "u" ? v : BigInt64Array,
  "%BigUint64Array%": typeof BigUint64Array > "u" ? v : BigUint64Array,
  "%Boolean%": Boolean,
  "%DataView%": typeof DataView > "u" ? v : DataView,
  "%Date%": Date,
  "%decodeURI%": decodeURI,
  "%decodeURIComponent%": decodeURIComponent,
  "%encodeURI%": encodeURI,
  "%encodeURIComponent%": encodeURIComponent,
  "%Error%": na,
  "%eval%": eval,
  // eslint-disable-line no-eval
  "%EvalError%": ia,
  "%Float32Array%": typeof Float32Array > "u" ? v : Float32Array,
  "%Float64Array%": typeof Float64Array > "u" ? v : Float64Array,
  "%FinalizationRegistry%": typeof FinalizationRegistry > "u" ? v : FinalizationRegistry,
  "%Function%": Dn,
  "%GeneratorFunction%": Ie,
  "%Int8Array%": typeof Int8Array > "u" ? v : Int8Array,
  "%Int16Array%": typeof Int16Array > "u" ? v : Int16Array,
  "%Int32Array%": typeof Int32Array > "u" ? v : Int32Array,
  "%isFinite%": isFinite,
  "%isNaN%": isNaN,
  "%IteratorPrototype%": ke && q ? q(q([][Symbol.iterator]())) : v,
  "%JSON%": typeof JSON == "object" ? JSON : v,
  "%Map%": typeof Map > "u" ? v : Map,
  "%MapIteratorPrototype%": typeof Map > "u" || !ke || !q ? v : q((/* @__PURE__ */ new Map())[Symbol.iterator]()),
  "%Math%": Math,
  "%Number%": Number,
  "%Object%": Object,
  "%parseFloat%": parseFloat,
  "%parseInt%": parseInt,
  "%Promise%": typeof Promise > "u" ? v : Promise,
  "%Proxy%": typeof Proxy > "u" ? v : Proxy,
  "%RangeError%": oa,
  "%ReferenceError%": aa,
  "%Reflect%": typeof Reflect > "u" ? v : Reflect,
  "%RegExp%": RegExp,
  "%Set%": typeof Set > "u" ? v : Set,
  "%SetIteratorPrototype%": typeof Set > "u" || !ke || !q ? v : q((/* @__PURE__ */ new Set())[Symbol.iterator]()),
  "%SharedArrayBuffer%": typeof SharedArrayBuffer > "u" ? v : SharedArrayBuffer,
  "%String%": String,
  "%StringIteratorPrototype%": ke && q ? q(""[Symbol.iterator]()) : v,
  "%Symbol%": ke ? Symbol : v,
  "%SyntaxError%": Ne,
  "%ThrowTypeError%": la,
  "%TypedArray%": pa,
  "%TypeError%": ze,
  "%Uint8Array%": typeof Uint8Array > "u" ? v : Uint8Array,
  "%Uint8ClampedArray%": typeof Uint8ClampedArray > "u" ? v : Uint8ClampedArray,
  "%Uint16Array%": typeof Uint16Array > "u" ? v : Uint16Array,
  "%Uint32Array%": typeof Uint32Array > "u" ? v : Uint32Array,
  "%URIError%": sa,
  "%WeakMap%": typeof WeakMap > "u" ? v : WeakMap,
  "%WeakRef%": typeof WeakRef > "u" ? v : WeakRef,
  "%WeakSet%": typeof WeakSet > "u" ? v : WeakSet
};
if (q)
  try {
    null.error;
  } catch (t) {
    var fa = q(q(t));
    xe["%Error.prototype%"] = fa;
  }
var ca = function t(e) {
  var r;
  if (e === "%AsyncFunction%")
    r = Tt("async function () {}");
  else if (e === "%GeneratorFunction%")
    r = Tt("function* () {}");
  else if (e === "%AsyncGeneratorFunction%")
    r = Tt("async function* () {}");
  else if (e === "%AsyncGenerator%") {
    var n = t("%AsyncGeneratorFunction%");
    n && (r = n.prototype);
  } else if (e === "%AsyncIteratorPrototype%") {
    var i = t("%AsyncGenerator%");
    i && q && (r = q(i.prototype));
  }
  return xe[e] = r, r;
}, Dr = {
  __proto__: null,
  "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
  "%ArrayPrototype%": ["Array", "prototype"],
  "%ArrayProto_entries%": ["Array", "prototype", "entries"],
  "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
  "%ArrayProto_keys%": ["Array", "prototype", "keys"],
  "%ArrayProto_values%": ["Array", "prototype", "values"],
  "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
  "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
  "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
  "%BooleanPrototype%": ["Boolean", "prototype"],
  "%DataViewPrototype%": ["DataView", "prototype"],
  "%DatePrototype%": ["Date", "prototype"],
  "%ErrorPrototype%": ["Error", "prototype"],
  "%EvalErrorPrototype%": ["EvalError", "prototype"],
  "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
  "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
  "%FunctionPrototype%": ["Function", "prototype"],
  "%Generator%": ["GeneratorFunction", "prototype"],
  "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
  "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
  "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
  "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
  "%JSONParse%": ["JSON", "parse"],
  "%JSONStringify%": ["JSON", "stringify"],
  "%MapPrototype%": ["Map", "prototype"],
  "%NumberPrototype%": ["Number", "prototype"],
  "%ObjectPrototype%": ["Object", "prototype"],
  "%ObjProto_toString%": ["Object", "prototype", "toString"],
  "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
  "%PromisePrototype%": ["Promise", "prototype"],
  "%PromiseProto_then%": ["Promise", "prototype", "then"],
  "%Promise_all%": ["Promise", "all"],
  "%Promise_reject%": ["Promise", "reject"],
  "%Promise_resolve%": ["Promise", "resolve"],
  "%RangeErrorPrototype%": ["RangeError", "prototype"],
  "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
  "%RegExpPrototype%": ["RegExp", "prototype"],
  "%SetPrototype%": ["Set", "prototype"],
  "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
  "%StringPrototype%": ["String", "prototype"],
  "%SymbolPrototype%": ["Symbol", "prototype"],
  "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
  "%TypedArrayPrototype%": ["TypedArray", "prototype"],
  "%TypeErrorPrototype%": ["TypeError", "prototype"],
  "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
  "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
  "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
  "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
  "%URIErrorPrototype%": ["URIError", "prototype"],
  "%WeakMapPrototype%": ["WeakMap", "prototype"],
  "%WeakSetPrototype%": ["WeakSet", "prototype"]
}, Ke = fr, dt = ra, da = Ke.call(Function.call, Array.prototype.concat), ha = Ke.call(Function.apply, Array.prototype.splice), zr = Ke.call(Function.call, String.prototype.replace), ht = Ke.call(Function.call, String.prototype.slice), ya = Ke.call(Function.call, RegExp.prototype.exec), ma = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g, ga = /\\(\\)?/g, wa = function(e) {
  var r = ht(e, 0, 1), n = ht(e, -1);
  if (r === "%" && n !== "%")
    throw new Ne("invalid intrinsic syntax, expected closing `%`");
  if (n === "%" && r !== "%")
    throw new Ne("invalid intrinsic syntax, expected opening `%`");
  var i = [];
  return zr(e, ma, function(o, a, s, u) {
    i[i.length] = s ? zr(u, ga, "$1") : a || o;
  }), i;
}, va = function(e, r) {
  var n = e, i;
  if (dt(Dr, n) && (i = Dr[n], n = "%" + i[0] + "%"), dt(xe, n)) {
    var o = xe[n];
    if (o === Ie && (o = ca(n)), typeof o > "u" && !r)
      throw new ze("intrinsic " + e + " exists, but is not available. Please file an issue!");
    return {
      alias: i,
      name: n,
      value: o
    };
  }
  throw new Ne("intrinsic " + e + " does not exist!");
}, We = function(e, r) {
  if (typeof e != "string" || e.length === 0)
    throw new ze("intrinsic name must be a non-empty string");
  if (arguments.length > 1 && typeof r != "boolean")
    throw new ze('"allowMissing" argument must be a boolean');
  if (ya(/^%?[^%]*%?$/, e) === null)
    throw new Ne("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
  var n = wa(e), i = n.length > 0 ? n[0] : "", o = va("%" + i + "%", r), a = o.name, s = o.value, u = !1, l = o.alias;
  l && (i = l[0], ha(n, da([0, 1], l)));
  for (var p = 1, c = !0; p < n.length; p += 1) {
    var f = n[p], d = ht(f, 0, 1), g = ht(f, -1);
    if ((d === '"' || d === "'" || d === "`" || g === '"' || g === "'" || g === "`") && d !== g)
      throw new Ne("property names with quotes must have matching quotes");
    if ((f === "constructor" || !c) && (u = !0), i += "." + f, a = "%" + i + "%", dt(xe, a))
      s = xe[a];
    else if (s != null) {
      if (!(f in s)) {
        if (!r)
          throw new ze("base intrinsic for " + e + " exists, but the property is not available.");
        return;
      }
      if (Fe && p + 1 >= n.length) {
        var S = Fe(s, f);
        c = !!S, c && "get" in S && !("originalValue" in S.get) ? s = S.get : s = s[f];
      } else
        c = dt(s, f), s = s[f];
      c && !u && (xe[a] = s);
    }
  }
  return s;
}, zn = { exports: {} }, kt, Mr;
function cr() {
  if (Mr)
    return kt;
  Mr = 1;
  var t = We, e = t("%Object.defineProperty%", !0) || !1;
  if (e)
    try {
      e({}, "a", { value: 1 });
    } catch {
      e = !1;
    }
  return kt = e, kt;
}
var ba = We, ot = ba("%Object.getOwnPropertyDescriptor%", !0);
if (ot)
  try {
    ot([], "length");
  } catch {
    ot = null;
  }
var Mn = ot, Nr = cr(), $a = Ln, Ce = Je, qr = Mn, Ea = function(e, r, n) {
  if (!e || typeof e != "object" && typeof e != "function")
    throw new Ce("`obj` must be an object or a function`");
  if (typeof r != "string" && typeof r != "symbol")
    throw new Ce("`property` must be a string or a symbol`");
  if (arguments.length > 3 && typeof arguments[3] != "boolean" && arguments[3] !== null)
    throw new Ce("`nonEnumerable`, if provided, must be a boolean or null");
  if (arguments.length > 4 && typeof arguments[4] != "boolean" && arguments[4] !== null)
    throw new Ce("`nonWritable`, if provided, must be a boolean or null");
  if (arguments.length > 5 && typeof arguments[5] != "boolean" && arguments[5] !== null)
    throw new Ce("`nonConfigurable`, if provided, must be a boolean or null");
  if (arguments.length > 6 && typeof arguments[6] != "boolean")
    throw new Ce("`loose`, if provided, must be a boolean");
  var i = arguments.length > 3 ? arguments[3] : null, o = arguments.length > 4 ? arguments[4] : null, a = arguments.length > 5 ? arguments[5] : null, s = arguments.length > 6 ? arguments[6] : !1, u = !!qr && qr(e, r);
  if (Nr)
    Nr(e, r, {
      configurable: a === null && u ? u.configurable : !a,
      enumerable: i === null && u ? u.enumerable : !i,
      value: n,
      writable: o === null && u ? u.writable : !o
    });
  else if (s || !i && !o && !a)
    e[r] = n;
  else
    throw new $a("This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.");
}, Gt = cr(), Nn = function() {
  return !!Gt;
};
Nn.hasArrayLengthDefineBug = function() {
  if (!Gt)
    return null;
  try {
    return Gt([], "length", { value: 1 }).length !== 1;
  } catch {
    return !0;
  }
};
var _a = Nn, Pa = We, jr = Ea, Sa = _a(), Wr = Mn, Br = Je, Aa = Pa("%Math.floor%"), Fa = function(e, r) {
  if (typeof e != "function")
    throw new Br("`fn` is not a function");
  if (typeof r != "number" || r < 0 || r > 4294967295 || Aa(r) !== r)
    throw new Br("`length` must be a positive 32-bit integer");
  var n = arguments.length > 2 && !!arguments[2], i = !0, o = !0;
  if ("length" in e && Wr) {
    var a = Wr(e, "length");
    a && !a.configurable && (i = !1), a && !a.writable && (o = !1);
  }
  return (i || o || !n) && (Sa ? jr(
    /** @type {Parameters<define>[0]} */
    e,
    "length",
    r,
    !0,
    !0
  ) : jr(
    /** @type {Parameters<define>[0]} */
    e,
    "length",
    r
  )), e;
};
(function(t) {
  var e = fr, r = We, n = Fa, i = Je, o = r("%Function.prototype.apply%"), a = r("%Function.prototype.call%"), s = r("%Reflect.apply%", !0) || e.call(a, o), u = cr(), l = r("%Math.max%");
  t.exports = function(f) {
    if (typeof f != "function")
      throw new i("a function is required");
    var d = s(e, a, arguments);
    return n(
      d,
      1 + l(0, f.length - (arguments.length - 1)),
      !0
    );
  };
  var p = function() {
    return s(e, o, arguments);
  };
  u ? u(t.exports, "apply", { value: p }) : t.exports.apply = p;
})(zn);
var xa = zn.exports, qn = We, jn = xa, Oa = jn(qn("String.prototype.indexOf")), Ta = function(e, r) {
  var n = qn(e, !!r);
  return typeof n == "function" && Oa(e, ".prototype.") > -1 ? jn(n) : n;
};
const Ra = {}, ka = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ra
}, Symbol.toStringTag, { value: "Module" })), Ca = /* @__PURE__ */ wo(ka);
var dr = typeof Map == "function" && Map.prototype, Ct = Object.getOwnPropertyDescriptor && dr ? Object.getOwnPropertyDescriptor(Map.prototype, "size") : null, yt = dr && Ct && typeof Ct.get == "function" ? Ct.get : null, Ur = dr && Map.prototype.forEach, hr = typeof Set == "function" && Set.prototype, It = Object.getOwnPropertyDescriptor && hr ? Object.getOwnPropertyDescriptor(Set.prototype, "size") : null, mt = hr && It && typeof It.get == "function" ? It.get : null, Zr = hr && Set.prototype.forEach, Ia = typeof WeakMap == "function" && WeakMap.prototype, He = Ia ? WeakMap.prototype.has : null, La = typeof WeakSet == "function" && WeakSet.prototype, Ve = La ? WeakSet.prototype.has : null, Da = typeof WeakRef == "function" && WeakRef.prototype, Hr = Da ? WeakRef.prototype.deref : null, za = Boolean.prototype.valueOf, Ma = Object.prototype.toString, Na = Function.prototype.toString, qa = String.prototype.match, yr = String.prototype.slice, be = String.prototype.replace, ja = String.prototype.toUpperCase, Vr = String.prototype.toLowerCase, Wn = RegExp.prototype.test, Gr = Array.prototype.concat, pe = Array.prototype.join, Wa = Array.prototype.slice, Qr = Math.floor, Qt = typeof BigInt == "function" ? BigInt.prototype.valueOf : null, Lt = Object.getOwnPropertySymbols, Jt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? Symbol.prototype.toString : null, qe = typeof Symbol == "function" && typeof Symbol.iterator == "object", Z = typeof Symbol == "function" && Symbol.toStringTag && (typeof Symbol.toStringTag === qe || "symbol") ? Symbol.toStringTag : null, Bn = Object.prototype.propertyIsEnumerable, Jr = (typeof Reflect == "function" ? Reflect.getPrototypeOf : Object.getPrototypeOf) || ([].__proto__ === Array.prototype ? function(t) {
  return t.__proto__;
} : null);
function Kr(t, e) {
  if (t === 1 / 0 || t === -1 / 0 || t !== t || t && t > -1e3 && t < 1e3 || Wn.call(/e/, e))
    return e;
  var r = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
  if (typeof t == "number") {
    var n = t < 0 ? -Qr(-t) : Qr(t);
    if (n !== t) {
      var i = String(n), o = yr.call(e, i.length + 1);
      return be.call(i, r, "$&_") + "." + be.call(be.call(o, /([0-9]{3})/g, "$&_"), /_$/, "");
    }
  }
  return be.call(e, r, "$&_");
}
var Kt = Ca, Yr = Kt.custom, Xr = Zn(Yr) ? Yr : null, Ba = function t(e, r, n, i) {
  var o = r || {};
  if (ve(o, "quoteStyle") && o.quoteStyle !== "single" && o.quoteStyle !== "double")
    throw new TypeError('option "quoteStyle" must be "single" or "double"');
  if (ve(o, "maxStringLength") && (typeof o.maxStringLength == "number" ? o.maxStringLength < 0 && o.maxStringLength !== 1 / 0 : o.maxStringLength !== null))
    throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
  var a = ve(o, "customInspect") ? o.customInspect : !0;
  if (typeof a != "boolean" && a !== "symbol")
    throw new TypeError("option \"customInspect\", if provided, must be `true`, `false`, or `'symbol'`");
  if (ve(o, "indent") && o.indent !== null && o.indent !== "	" && !(parseInt(o.indent, 10) === o.indent && o.indent > 0))
    throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
  if (ve(o, "numericSeparator") && typeof o.numericSeparator != "boolean")
    throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
  var s = o.numericSeparator;
  if (typeof e > "u")
    return "undefined";
  if (e === null)
    return "null";
  if (typeof e == "boolean")
    return e ? "true" : "false";
  if (typeof e == "string")
    return Vn(e, o);
  if (typeof e == "number") {
    if (e === 0)
      return 1 / 0 / e > 0 ? "0" : "-0";
    var u = String(e);
    return s ? Kr(e, u) : u;
  }
  if (typeof e == "bigint") {
    var l = String(e) + "n";
    return s ? Kr(e, l) : l;
  }
  var p = typeof o.depth > "u" ? 5 : o.depth;
  if (typeof n > "u" && (n = 0), n >= p && p > 0 && typeof e == "object")
    return Yt(e) ? "[Array]" : "[Object]";
  var c = ss(o, n);
  if (typeof i > "u")
    i = [];
  else if (Hn(i, e) >= 0)
    return "[Circular]";
  function f(z, V, G) {
    if (V && (i = Wa.call(i), i.push(V)), G) {
      var J = {
        depth: o.depth
      };
      return ve(o, "quoteStyle") && (J.quoteStyle = o.quoteStyle), t(z, J, n + 1, i);
    }
    return t(z, o, n + 1, i);
  }
  if (typeof e == "function" && !en(e)) {
    var d = Ya(e), g = et(e, f);
    return "[Function" + (d ? ": " + d : " (anonymous)") + "]" + (g.length > 0 ? " { " + pe.call(g, ", ") + " }" : "");
  }
  if (Zn(e)) {
    var S = qe ? be.call(String(e), /^(Symbol\(.*\))_[^)]*$/, "$1") : Jt.call(e);
    return typeof e == "object" && !qe ? Ue(S) : S;
  }
  if (is(e)) {
    for (var b = "<" + Vr.call(String(e.nodeName)), D = e.attributes || [], h = 0; h < D.length; h++)
      b += " " + D[h].name + "=" + Un(Ua(D[h].value), "double", o);
    return b += ">", e.childNodes && e.childNodes.length && (b += "..."), b += "</" + Vr.call(String(e.nodeName)) + ">", b;
  }
  if (Yt(e)) {
    if (e.length === 0)
      return "[]";
    var y = et(e, f);
    return c && !as(y) ? "[" + Xt(y, c) + "]" : "[ " + pe.call(y, ", ") + " ]";
  }
  if (Ha(e)) {
    var E = et(e, f);
    return !("cause" in Error.prototype) && "cause" in e && !Bn.call(e, "cause") ? "{ [" + String(e) + "] " + pe.call(Gr.call("[cause]: " + f(e.cause), E), ", ") + " }" : E.length === 0 ? "[" + String(e) + "]" : "{ [" + String(e) + "] " + pe.call(E, ", ") + " }";
  }
  if (typeof e == "object" && a) {
    if (Xr && typeof e[Xr] == "function" && Kt)
      return Kt(e, { depth: p - n });
    if (a !== "symbol" && typeof e.inspect == "function")
      return e.inspect();
  }
  if (Xa(e)) {
    var $ = [];
    return Ur && Ur.call(e, function(z, V) {
      $.push(f(V, e, !0) + " => " + f(z, e));
    }), tn("Map", yt.call(e), $, c);
  }
  if (rs(e)) {
    var A = [];
    return Zr && Zr.call(e, function(z) {
      A.push(f(z, e));
    }), tn("Set", mt.call(e), A, c);
  }
  if (es(e))
    return Dt("WeakMap");
  if (ns(e))
    return Dt("WeakSet");
  if (ts(e))
    return Dt("WeakRef");
  if (Ga(e))
    return Ue(f(Number(e)));
  if (Ja(e))
    return Ue(f(Qt.call(e)));
  if (Qa(e))
    return Ue(za.call(e));
  if (Va(e))
    return Ue(f(String(e)));
  if (typeof window < "u" && e === window)
    return "{ [object Window] }";
  if (typeof globalThis < "u" && e === globalThis || typeof Ze < "u" && e === Ze)
    return "{ [object globalThis] }";
  if (!Za(e) && !en(e)) {
    var H = et(e, f), O = Jr ? Jr(e) === Object.prototype : e instanceof Object || e.constructor === Object, T = e instanceof Object ? "" : "null prototype", N = !O && Z && Object(e) === e && Z in e ? yr.call(Ee(e), 8, -1) : T ? "Object" : "", re = O || typeof e.constructor != "function" ? "" : e.constructor.name ? e.constructor.name + " " : "", ne = re + (N || T ? "[" + pe.call(Gr.call([], N || [], T || []), ": ") + "] " : "");
    return H.length === 0 ? ne + "{}" : c ? ne + "{" + Xt(H, c) + "}" : ne + "{ " + pe.call(H, ", ") + " }";
  }
  return String(e);
};
function Un(t, e, r) {
  var n = (r.quoteStyle || e) === "double" ? '"' : "'";
  return n + t + n;
}
function Ua(t) {
  return be.call(String(t), /"/g, "&quot;");
}
function Yt(t) {
  return Ee(t) === "[object Array]" && (!Z || !(typeof t == "object" && Z in t));
}
function Za(t) {
  return Ee(t) === "[object Date]" && (!Z || !(typeof t == "object" && Z in t));
}
function en(t) {
  return Ee(t) === "[object RegExp]" && (!Z || !(typeof t == "object" && Z in t));
}
function Ha(t) {
  return Ee(t) === "[object Error]" && (!Z || !(typeof t == "object" && Z in t));
}
function Va(t) {
  return Ee(t) === "[object String]" && (!Z || !(typeof t == "object" && Z in t));
}
function Ga(t) {
  return Ee(t) === "[object Number]" && (!Z || !(typeof t == "object" && Z in t));
}
function Qa(t) {
  return Ee(t) === "[object Boolean]" && (!Z || !(typeof t == "object" && Z in t));
}
function Zn(t) {
  if (qe)
    return t && typeof t == "object" && t instanceof Symbol;
  if (typeof t == "symbol")
    return !0;
  if (!t || typeof t != "object" || !Jt)
    return !1;
  try {
    return Jt.call(t), !0;
  } catch {
  }
  return !1;
}
function Ja(t) {
  if (!t || typeof t != "object" || !Qt)
    return !1;
  try {
    return Qt.call(t), !0;
  } catch {
  }
  return !1;
}
var Ka = Object.prototype.hasOwnProperty || function(t) {
  return t in this;
};
function ve(t, e) {
  return Ka.call(t, e);
}
function Ee(t) {
  return Ma.call(t);
}
function Ya(t) {
  if (t.name)
    return t.name;
  var e = qa.call(Na.call(t), /^function\s*([\w$]+)/);
  return e ? e[1] : null;
}
function Hn(t, e) {
  if (t.indexOf)
    return t.indexOf(e);
  for (var r = 0, n = t.length; r < n; r++)
    if (t[r] === e)
      return r;
  return -1;
}
function Xa(t) {
  if (!yt || !t || typeof t != "object")
    return !1;
  try {
    yt.call(t);
    try {
      mt.call(t);
    } catch {
      return !0;
    }
    return t instanceof Map;
  } catch {
  }
  return !1;
}
function es(t) {
  if (!He || !t || typeof t != "object")
    return !1;
  try {
    He.call(t, He);
    try {
      Ve.call(t, Ve);
    } catch {
      return !0;
    }
    return t instanceof WeakMap;
  } catch {
  }
  return !1;
}
function ts(t) {
  if (!Hr || !t || typeof t != "object")
    return !1;
  try {
    return Hr.call(t), !0;
  } catch {
  }
  return !1;
}
function rs(t) {
  if (!mt || !t || typeof t != "object")
    return !1;
  try {
    mt.call(t);
    try {
      yt.call(t);
    } catch {
      return !0;
    }
    return t instanceof Set;
  } catch {
  }
  return !1;
}
function ns(t) {
  if (!Ve || !t || typeof t != "object")
    return !1;
  try {
    Ve.call(t, Ve);
    try {
      He.call(t, He);
    } catch {
      return !0;
    }
    return t instanceof WeakSet;
  } catch {
  }
  return !1;
}
function is(t) {
  return !t || typeof t != "object" ? !1 : typeof HTMLElement < "u" && t instanceof HTMLElement ? !0 : typeof t.nodeName == "string" && typeof t.getAttribute == "function";
}
function Vn(t, e) {
  if (t.length > e.maxStringLength) {
    var r = t.length - e.maxStringLength, n = "... " + r + " more character" + (r > 1 ? "s" : "");
    return Vn(yr.call(t, 0, e.maxStringLength), e) + n;
  }
  var i = be.call(be.call(t, /(['\\])/g, "\\$1"), /[\x00-\x1f]/g, os);
  return Un(i, "single", e);
}
function os(t) {
  var e = t.charCodeAt(0), r = {
    8: "b",
    9: "t",
    10: "n",
    12: "f",
    13: "r"
  }[e];
  return r ? "\\" + r : "\\x" + (e < 16 ? "0" : "") + ja.call(e.toString(16));
}
function Ue(t) {
  return "Object(" + t + ")";
}
function Dt(t) {
  return t + " { ? }";
}
function tn(t, e, r, n) {
  var i = n ? Xt(r, n) : pe.call(r, ", ");
  return t + " (" + e + ") {" + i + "}";
}
function as(t) {
  for (var e = 0; e < t.length; e++)
    if (Hn(t[e], `
`) >= 0)
      return !1;
  return !0;
}
function ss(t, e) {
  var r;
  if (t.indent === "	")
    r = "	";
  else if (typeof t.indent == "number" && t.indent > 0)
    r = pe.call(Array(t.indent + 1), " ");
  else
    return null;
  return {
    base: r,
    prev: pe.call(Array(e + 1), r)
  };
}
function Xt(t, e) {
  if (t.length === 0)
    return "";
  var r = `
` + e.prev + e.base;
  return r + pe.call(t, "," + r) + `
` + e.prev;
}
function et(t, e) {
  var r = Yt(t), n = [];
  if (r) {
    n.length = t.length;
    for (var i = 0; i < t.length; i++)
      n[i] = ve(t, i) ? e(t[i], t) : "";
  }
  var o = typeof Lt == "function" ? Lt(t) : [], a;
  if (qe) {
    a = {};
    for (var s = 0; s < o.length; s++)
      a["$" + o[s]] = o[s];
  }
  for (var u in t)
    ve(t, u) && (r && String(Number(u)) === u && u < t.length || qe && a["$" + u] instanceof Symbol || (Wn.call(/[^\w$]/, u) ? n.push(e(u, t) + ": " + e(t[u], t)) : n.push(u + ": " + e(t[u], t))));
  if (typeof Lt == "function")
    for (var l = 0; l < o.length; l++)
      Bn.call(t, o[l]) && n.push("[" + e(o[l]) + "]: " + e(t[o[l]], t));
  return n;
}
var Gn = We, Be = Ta, ls = Ba, us = Je, tt = Gn("%WeakMap%", !0), rt = Gn("%Map%", !0), ps = Be("WeakMap.prototype.get", !0), fs = Be("WeakMap.prototype.set", !0), cs = Be("WeakMap.prototype.has", !0), ds = Be("Map.prototype.get", !0), hs = Be("Map.prototype.set", !0), ys = Be("Map.prototype.has", !0), mr = function(t, e) {
  for (var r = t, n; (n = r.next) !== null; r = n)
    if (n.key === e)
      return r.next = n.next, n.next = /** @type {NonNullable<typeof list.next>} */
      t.next, t.next = n, n;
}, ms = function(t, e) {
  var r = mr(t, e);
  return r && r.value;
}, gs = function(t, e, r) {
  var n = mr(t, e);
  n ? n.value = r : t.next = /** @type {import('.').ListNode<typeof value>} */
  {
    // eslint-disable-line no-param-reassign, no-extra-parens
    key: e,
    next: t.next,
    value: r
  };
}, ws = function(t, e) {
  return !!mr(t, e);
}, vs = function() {
  var e, r, n, i = {
    assert: function(o) {
      if (!i.has(o))
        throw new us("Side channel does not contain " + ls(o));
    },
    get: function(o) {
      if (tt && o && (typeof o == "object" || typeof o == "function")) {
        if (e)
          return ps(e, o);
      } else if (rt) {
        if (r)
          return ds(r, o);
      } else if (n)
        return ms(n, o);
    },
    has: function(o) {
      if (tt && o && (typeof o == "object" || typeof o == "function")) {
        if (e)
          return cs(e, o);
      } else if (rt) {
        if (r)
          return ys(r, o);
      } else if (n)
        return ws(n, o);
      return !1;
    },
    set: function(o, a) {
      tt && o && (typeof o == "object" || typeof o == "function") ? (e || (e = new tt()), fs(e, o, a)) : rt ? (r || (r = new rt()), hs(r, o, a)) : (n || (n = { key: {}, next: null }), gs(n, o, a));
    }
  };
  return i;
}, bs = String.prototype.replace, $s = /%20/g, zt = {
  RFC1738: "RFC1738",
  RFC3986: "RFC3986"
}, gr = {
  default: zt.RFC3986,
  formatters: {
    RFC1738: function(t) {
      return bs.call(t, $s, "+");
    },
    RFC3986: function(t) {
      return String(t);
    }
  },
  RFC1738: zt.RFC1738,
  RFC3986: zt.RFC3986
}, Es = gr, Mt = Object.prototype.hasOwnProperty, Se = Array.isArray, le = function() {
  for (var t = [], e = 0; e < 256; ++e)
    t.push("%" + ((e < 16 ? "0" : "") + e.toString(16)).toUpperCase());
  return t;
}(), _s = function(e) {
  for (; e.length > 1; ) {
    var r = e.pop(), n = r.obj[r.prop];
    if (Se(n)) {
      for (var i = [], o = 0; o < n.length; ++o)
        typeof n[o] < "u" && i.push(n[o]);
      r.obj[r.prop] = i;
    }
  }
}, Qn = function(e, r) {
  for (var n = r && r.plainObjects ? /* @__PURE__ */ Object.create(null) : {}, i = 0; i < e.length; ++i)
    typeof e[i] < "u" && (n[i] = e[i]);
  return n;
}, Ps = function t(e, r, n) {
  if (!r)
    return e;
  if (typeof r != "object") {
    if (Se(e))
      e.push(r);
    else if (e && typeof e == "object")
      (n && (n.plainObjects || n.allowPrototypes) || !Mt.call(Object.prototype, r)) && (e[r] = !0);
    else
      return [e, r];
    return e;
  }
  if (!e || typeof e != "object")
    return [e].concat(r);
  var i = e;
  return Se(e) && !Se(r) && (i = Qn(e, n)), Se(e) && Se(r) ? (r.forEach(function(o, a) {
    if (Mt.call(e, a)) {
      var s = e[a];
      s && typeof s == "object" && o && typeof o == "object" ? e[a] = t(s, o, n) : e.push(o);
    } else
      e[a] = o;
  }), e) : Object.keys(r).reduce(function(o, a) {
    var s = r[a];
    return Mt.call(o, a) ? o[a] = t(o[a], s, n) : o[a] = s, o;
  }, i);
}, Ss = function(e, r) {
  return Object.keys(r).reduce(function(n, i) {
    return n[i] = r[i], n;
  }, e);
}, As = function(t, e, r) {
  var n = t.replace(/\+/g, " ");
  if (r === "iso-8859-1")
    return n.replace(/%[0-9a-f]{2}/gi, unescape);
  try {
    return decodeURIComponent(n);
  } catch {
    return n;
  }
}, Nt = 1024, Fs = function(e, r, n, i, o) {
  if (e.length === 0)
    return e;
  var a = e;
  if (typeof e == "symbol" ? a = Symbol.prototype.toString.call(e) : typeof e != "string" && (a = String(e)), n === "iso-8859-1")
    return escape(a).replace(/%u[0-9a-f]{4}/gi, function(d) {
      return "%26%23" + parseInt(d.slice(2), 16) + "%3B";
    });
  for (var s = "", u = 0; u < a.length; u += Nt) {
    for (var l = a.length >= Nt ? a.slice(u, u + Nt) : a, p = [], c = 0; c < l.length; ++c) {
      var f = l.charCodeAt(c);
      if (f === 45 || f === 46 || f === 95 || f === 126 || f >= 48 && f <= 57 || f >= 65 && f <= 90 || f >= 97 && f <= 122 || o === Es.RFC1738 && (f === 40 || f === 41)) {
        p[p.length] = l.charAt(c);
        continue;
      }
      if (f < 128) {
        p[p.length] = le[f];
        continue;
      }
      if (f < 2048) {
        p[p.length] = le[192 | f >> 6] + le[128 | f & 63];
        continue;
      }
      if (f < 55296 || f >= 57344) {
        p[p.length] = le[224 | f >> 12] + le[128 | f >> 6 & 63] + le[128 | f & 63];
        continue;
      }
      c += 1, f = 65536 + ((f & 1023) << 10 | l.charCodeAt(c) & 1023), p[p.length] = le[240 | f >> 18] + le[128 | f >> 12 & 63] + le[128 | f >> 6 & 63] + le[128 | f & 63];
    }
    s += p.join("");
  }
  return s;
}, xs = function(e) {
  for (var r = [{ obj: { o: e }, prop: "o" }], n = [], i = 0; i < r.length; ++i)
    for (var o = r[i], a = o.obj[o.prop], s = Object.keys(a), u = 0; u < s.length; ++u) {
      var l = s[u], p = a[l];
      typeof p == "object" && p !== null && n.indexOf(p) === -1 && (r.push({ obj: a, prop: l }), n.push(p));
    }
  return _s(r), e;
}, Os = function(e) {
  return Object.prototype.toString.call(e) === "[object RegExp]";
}, Ts = function(e) {
  return !e || typeof e != "object" ? !1 : !!(e.constructor && e.constructor.isBuffer && e.constructor.isBuffer(e));
}, Rs = function(e, r) {
  return [].concat(e, r);
}, ks = function(e, r) {
  if (Se(e)) {
    for (var n = [], i = 0; i < e.length; i += 1)
      n.push(r(e[i]));
    return n;
  }
  return r(e);
}, Jn = {
  arrayToObject: Qn,
  assign: Ss,
  combine: Rs,
  compact: xs,
  decode: As,
  encode: Fs,
  isBuffer: Ts,
  isRegExp: Os,
  maybeMap: ks,
  merge: Ps
}, Kn = vs, at = Jn, Ge = gr, Cs = Object.prototype.hasOwnProperty, Yn = {
  brackets: function(e) {
    return e + "[]";
  },
  comma: "comma",
  indices: function(e, r) {
    return e + "[" + r + "]";
  },
  repeat: function(e) {
    return e;
  }
}, ue = Array.isArray, Is = Array.prototype.push, Xn = function(t, e) {
  Is.apply(t, ue(e) ? e : [e]);
}, Ls = Date.prototype.toISOString, rn = Ge.default, M = {
  addQueryPrefix: !1,
  allowDots: !1,
  allowEmptyArrays: !1,
  arrayFormat: "indices",
  charset: "utf-8",
  charsetSentinel: !1,
  delimiter: "&",
  encode: !0,
  encodeDotInKeys: !1,
  encoder: at.encode,
  encodeValuesOnly: !1,
  format: rn,
  formatter: Ge.formatters[rn],
  // deprecated
  indices: !1,
  serializeDate: function(e) {
    return Ls.call(e);
  },
  skipNulls: !1,
  strictNullHandling: !1
}, Ds = function(e) {
  return typeof e == "string" || typeof e == "number" || typeof e == "boolean" || typeof e == "symbol" || typeof e == "bigint";
}, qt = {}, zs = function t(e, r, n, i, o, a, s, u, l, p, c, f, d, g, S, b, D, h) {
  for (var y = e, E = h, $ = 0, A = !1; (E = E.get(qt)) !== void 0 && !A; ) {
    var H = E.get(e);
    if ($ += 1, typeof H < "u") {
      if (H === $)
        throw new RangeError("Cyclic object value");
      A = !0;
    }
    typeof E.get(qt) > "u" && ($ = 0);
  }
  if (typeof p == "function" ? y = p(r, y) : y instanceof Date ? y = d(y) : n === "comma" && ue(y) && (y = at.maybeMap(y, function(m) {
    return m instanceof Date ? d(m) : m;
  })), y === null) {
    if (a)
      return l && !b ? l(r, M.encoder, D, "key", g) : r;
    y = "";
  }
  if (Ds(y) || at.isBuffer(y)) {
    if (l) {
      var O = b ? r : l(r, M.encoder, D, "key", g);
      return [S(O) + "=" + S(l(y, M.encoder, D, "value", g))];
    }
    return [S(r) + "=" + S(String(y))];
  }
  var T = [];
  if (typeof y > "u")
    return T;
  var N;
  if (n === "comma" && ue(y))
    b && l && (y = at.maybeMap(y, l)), N = [{ value: y.length > 0 ? y.join(",") || null : void 0 }];
  else if (ue(p))
    N = p;
  else {
    var re = Object.keys(y);
    N = c ? re.sort(c) : re;
  }
  var ne = u ? r.replace(/\./g, "%2E") : r, z = i && ue(y) && y.length === 1 ? ne + "[]" : ne;
  if (o && ue(y) && y.length === 0)
    return z + "[]";
  for (var V = 0; V < N.length; ++V) {
    var G = N[V], J = typeof G == "object" && typeof G.value < "u" ? G.value : y[G];
    if (!(s && J === null)) {
      var ge = f && u ? G.replace(/\./g, "%2E") : G, Pt = ue(y) ? typeof n == "function" ? n(z, ge) : z : z + (f ? "." + ge : "[" + ge + "]");
      h.set(e, $);
      var Xe = Kn();
      Xe.set(qt, h), Xn(T, t(
        J,
        Pt,
        n,
        i,
        o,
        a,
        s,
        u,
        n === "comma" && b && ue(y) ? null : l,
        p,
        c,
        f,
        d,
        g,
        S,
        b,
        D,
        Xe
      ));
    }
  }
  return T;
}, Ms = function(e) {
  if (!e)
    return M;
  if (typeof e.allowEmptyArrays < "u" && typeof e.allowEmptyArrays != "boolean")
    throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
  if (typeof e.encodeDotInKeys < "u" && typeof e.encodeDotInKeys != "boolean")
    throw new TypeError("`encodeDotInKeys` option can only be `true` or `false`, when provided");
  if (e.encoder !== null && typeof e.encoder < "u" && typeof e.encoder != "function")
    throw new TypeError("Encoder has to be a function.");
  var r = e.charset || M.charset;
  if (typeof e.charset < "u" && e.charset !== "utf-8" && e.charset !== "iso-8859-1")
    throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
  var n = Ge.default;
  if (typeof e.format < "u") {
    if (!Cs.call(Ge.formatters, e.format))
      throw new TypeError("Unknown format option provided.");
    n = e.format;
  }
  var i = Ge.formatters[n], o = M.filter;
  (typeof e.filter == "function" || ue(e.filter)) && (o = e.filter);
  var a;
  if (e.arrayFormat in Yn ? a = e.arrayFormat : "indices" in e ? a = e.indices ? "indices" : "repeat" : a = M.arrayFormat, "commaRoundTrip" in e && typeof e.commaRoundTrip != "boolean")
    throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
  var s = typeof e.allowDots > "u" ? e.encodeDotInKeys === !0 ? !0 : M.allowDots : !!e.allowDots;
  return {
    addQueryPrefix: typeof e.addQueryPrefix == "boolean" ? e.addQueryPrefix : M.addQueryPrefix,
    allowDots: s,
    allowEmptyArrays: typeof e.allowEmptyArrays == "boolean" ? !!e.allowEmptyArrays : M.allowEmptyArrays,
    arrayFormat: a,
    charset: r,
    charsetSentinel: typeof e.charsetSentinel == "boolean" ? e.charsetSentinel : M.charsetSentinel,
    commaRoundTrip: e.commaRoundTrip,
    delimiter: typeof e.delimiter > "u" ? M.delimiter : e.delimiter,
    encode: typeof e.encode == "boolean" ? e.encode : M.encode,
    encodeDotInKeys: typeof e.encodeDotInKeys == "boolean" ? e.encodeDotInKeys : M.encodeDotInKeys,
    encoder: typeof e.encoder == "function" ? e.encoder : M.encoder,
    encodeValuesOnly: typeof e.encodeValuesOnly == "boolean" ? e.encodeValuesOnly : M.encodeValuesOnly,
    filter: o,
    format: n,
    formatter: i,
    serializeDate: typeof e.serializeDate == "function" ? e.serializeDate : M.serializeDate,
    skipNulls: typeof e.skipNulls == "boolean" ? e.skipNulls : M.skipNulls,
    sort: typeof e.sort == "function" ? e.sort : null,
    strictNullHandling: typeof e.strictNullHandling == "boolean" ? e.strictNullHandling : M.strictNullHandling
  };
}, Ns = function(t, e) {
  var r = t, n = Ms(e), i, o;
  typeof n.filter == "function" ? (o = n.filter, r = o("", r)) : ue(n.filter) && (o = n.filter, i = o);
  var a = [];
  if (typeof r != "object" || r === null)
    return "";
  var s = Yn[n.arrayFormat], u = s === "comma" && n.commaRoundTrip;
  i || (i = Object.keys(r)), n.sort && i.sort(n.sort);
  for (var l = Kn(), p = 0; p < i.length; ++p) {
    var c = i[p];
    n.skipNulls && r[c] === null || Xn(a, zs(
      r[c],
      c,
      s,
      u,
      n.allowEmptyArrays,
      n.strictNullHandling,
      n.skipNulls,
      n.encodeDotInKeys,
      n.encode ? n.encoder : null,
      n.filter,
      n.sort,
      n.allowDots,
      n.serializeDate,
      n.format,
      n.formatter,
      n.encodeValuesOnly,
      n.charset,
      l
    ));
  }
  var f = a.join(n.delimiter), d = n.addQueryPrefix === !0 ? "?" : "";
  return n.charsetSentinel && (n.charset === "iso-8859-1" ? d += "utf8=%26%2310003%3B&" : d += "utf8=%E2%9C%93&"), f.length > 0 ? d + f : "";
}, je = Jn, er = Object.prototype.hasOwnProperty, qs = Array.isArray, k = {
  allowDots: !1,
  allowEmptyArrays: !1,
  allowPrototypes: !1,
  allowSparse: !1,
  arrayLimit: 20,
  charset: "utf-8",
  charsetSentinel: !1,
  comma: !1,
  decodeDotInKeys: !1,
  decoder: je.decode,
  delimiter: "&",
  depth: 5,
  duplicates: "combine",
  ignoreQueryPrefix: !1,
  interpretNumericEntities: !1,
  parameterLimit: 1e3,
  parseArrays: !0,
  plainObjects: !1,
  strictNullHandling: !1
}, js = function(t) {
  return t.replace(/&#(\d+);/g, function(e, r) {
    return String.fromCharCode(parseInt(r, 10));
  });
}, ei = function(t, e) {
  return t && typeof t == "string" && e.comma && t.indexOf(",") > -1 ? t.split(",") : t;
}, Ws = "utf8=%26%2310003%3B", Bs = "utf8=%E2%9C%93", Us = function(e, r) {
  var n = { __proto__: null }, i = r.ignoreQueryPrefix ? e.replace(/^\?/, "") : e;
  i = i.replace(/%5B/gi, "[").replace(/%5D/gi, "]");
  var o = r.parameterLimit === 1 / 0 ? void 0 : r.parameterLimit, a = i.split(r.delimiter, o), s = -1, u, l = r.charset;
  if (r.charsetSentinel)
    for (u = 0; u < a.length; ++u)
      a[u].indexOf("utf8=") === 0 && (a[u] === Bs ? l = "utf-8" : a[u] === Ws && (l = "iso-8859-1"), s = u, u = a.length);
  for (u = 0; u < a.length; ++u)
    if (u !== s) {
      var p = a[u], c = p.indexOf("]="), f = c === -1 ? p.indexOf("=") : c + 1, d, g;
      f === -1 ? (d = r.decoder(p, k.decoder, l, "key"), g = r.strictNullHandling ? null : "") : (d = r.decoder(p.slice(0, f), k.decoder, l, "key"), g = je.maybeMap(
        ei(p.slice(f + 1), r),
        function(b) {
          return r.decoder(b, k.decoder, l, "value");
        }
      )), g && r.interpretNumericEntities && l === "iso-8859-1" && (g = js(g)), p.indexOf("[]=") > -1 && (g = qs(g) ? [g] : g);
      var S = er.call(n, d);
      S && r.duplicates === "combine" ? n[d] = je.combine(n[d], g) : (!S || r.duplicates === "last") && (n[d] = g);
    }
  return n;
}, Zs = function(t, e, r, n) {
  for (var i = n ? e : ei(e, r), o = t.length - 1; o >= 0; --o) {
    var a, s = t[o];
    if (s === "[]" && r.parseArrays)
      a = r.allowEmptyArrays && (i === "" || r.strictNullHandling && i === null) ? [] : [].concat(i);
    else {
      a = r.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
      var u = s.charAt(0) === "[" && s.charAt(s.length - 1) === "]" ? s.slice(1, -1) : s, l = r.decodeDotInKeys ? u.replace(/%2E/g, ".") : u, p = parseInt(l, 10);
      !r.parseArrays && l === "" ? a = { 0: i } : !isNaN(p) && s !== l && String(p) === l && p >= 0 && r.parseArrays && p <= r.arrayLimit ? (a = [], a[p] = i) : l !== "__proto__" && (a[l] = i);
    }
    i = a;
  }
  return i;
}, Hs = function(e, r, n, i) {
  if (e) {
    var o = n.allowDots ? e.replace(/\.([^.[]+)/g, "[$1]") : e, a = /(\[[^[\]]*])/, s = /(\[[^[\]]*])/g, u = n.depth > 0 && a.exec(o), l = u ? o.slice(0, u.index) : o, p = [];
    if (l) {
      if (!n.plainObjects && er.call(Object.prototype, l) && !n.allowPrototypes)
        return;
      p.push(l);
    }
    for (var c = 0; n.depth > 0 && (u = s.exec(o)) !== null && c < n.depth; ) {
      if (c += 1, !n.plainObjects && er.call(Object.prototype, u[1].slice(1, -1)) && !n.allowPrototypes)
        return;
      p.push(u[1]);
    }
    return u && p.push("[" + o.slice(u.index) + "]"), Zs(p, r, n, i);
  }
}, Vs = function(e) {
  if (!e)
    return k;
  if (typeof e.allowEmptyArrays < "u" && typeof e.allowEmptyArrays != "boolean")
    throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
  if (typeof e.decodeDotInKeys < "u" && typeof e.decodeDotInKeys != "boolean")
    throw new TypeError("`decodeDotInKeys` option can only be `true` or `false`, when provided");
  if (e.decoder !== null && typeof e.decoder < "u" && typeof e.decoder != "function")
    throw new TypeError("Decoder has to be a function.");
  if (typeof e.charset < "u" && e.charset !== "utf-8" && e.charset !== "iso-8859-1")
    throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
  var r = typeof e.charset > "u" ? k.charset : e.charset, n = typeof e.duplicates > "u" ? k.duplicates : e.duplicates;
  if (n !== "combine" && n !== "first" && n !== "last")
    throw new TypeError("The duplicates option must be either combine, first, or last");
  var i = typeof e.allowDots > "u" ? e.decodeDotInKeys === !0 ? !0 : k.allowDots : !!e.allowDots;
  return {
    allowDots: i,
    allowEmptyArrays: typeof e.allowEmptyArrays == "boolean" ? !!e.allowEmptyArrays : k.allowEmptyArrays,
    allowPrototypes: typeof e.allowPrototypes == "boolean" ? e.allowPrototypes : k.allowPrototypes,
    allowSparse: typeof e.allowSparse == "boolean" ? e.allowSparse : k.allowSparse,
    arrayLimit: typeof e.arrayLimit == "number" ? e.arrayLimit : k.arrayLimit,
    charset: r,
    charsetSentinel: typeof e.charsetSentinel == "boolean" ? e.charsetSentinel : k.charsetSentinel,
    comma: typeof e.comma == "boolean" ? e.comma : k.comma,
    decodeDotInKeys: typeof e.decodeDotInKeys == "boolean" ? e.decodeDotInKeys : k.decodeDotInKeys,
    decoder: typeof e.decoder == "function" ? e.decoder : k.decoder,
    delimiter: typeof e.delimiter == "string" || je.isRegExp(e.delimiter) ? e.delimiter : k.delimiter,
    // eslint-disable-next-line no-implicit-coercion, no-extra-parens
    depth: typeof e.depth == "number" || e.depth === !1 ? +e.depth : k.depth,
    duplicates: n,
    ignoreQueryPrefix: e.ignoreQueryPrefix === !0,
    interpretNumericEntities: typeof e.interpretNumericEntities == "boolean" ? e.interpretNumericEntities : k.interpretNumericEntities,
    parameterLimit: typeof e.parameterLimit == "number" ? e.parameterLimit : k.parameterLimit,
    parseArrays: e.parseArrays !== !1,
    plainObjects: typeof e.plainObjects == "boolean" ? e.plainObjects : k.plainObjects,
    strictNullHandling: typeof e.strictNullHandling == "boolean" ? e.strictNullHandling : k.strictNullHandling
  };
}, Gs = function(t, e) {
  var r = Vs(e);
  if (t === "" || t === null || typeof t > "u")
    return r.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
  for (var n = typeof t == "string" ? Us(t, r) : t, i = r.plainObjects ? /* @__PURE__ */ Object.create(null) : {}, o = Object.keys(n), a = 0; a < o.length; ++a) {
    var s = o[a], u = Hs(s, n[s], r, typeof t == "string");
    i = je.merge(i, u, r);
  }
  return r.allowSparse === !0 ? i : je.compact(i);
}, Qs = Ns, Js = Gs, Ks = gr, Ys = {
  formats: Ks,
  parse: Js,
  stringify: Qs
}, Xs = Io;
function te() {
  this.protocol = null, this.slashes = null, this.auth = null, this.host = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.query = null, this.pathname = null, this.path = null, this.href = null;
}
var el = /^([a-z0-9.+-]+:)/i, tl = /:[0-9]*$/, rl = /^(\/\/?(?!\/)[^?\s]*)(\?[^\s]*)?$/, nl = [
  "<",
  ">",
  '"',
  "`",
  " ",
  "\r",
  `
`,
  "	"
], il = [
  "{",
  "}",
  "|",
  "\\",
  "^",
  "`"
].concat(nl), tr = ["'"].concat(il), nn = [
  "%",
  "/",
  "?",
  ";",
  "#"
].concat(tr), on = [
  "/",
  "?",
  "#"
], ol = 255, an = /^[+a-z0-9A-Z_-]{0,63}$/, al = /^([+a-z0-9A-Z_-]{0,63})(.*)$/, sl = {
  javascript: !0,
  "javascript:": !0
}, rr = {
  javascript: !0,
  "javascript:": !0
}, Me = {
  http: !0,
  https: !0,
  ftp: !0,
  gopher: !0,
  file: !0,
  "http:": !0,
  "https:": !0,
  "ftp:": !0,
  "gopher:": !0,
  "file:": !0
}, nr = Ys;
function Ye(t, e, r) {
  if (t && typeof t == "object" && t instanceof te)
    return t;
  var n = new te();
  return n.parse(t, e, r), n;
}
te.prototype.parse = function(t, e, r) {
  if (typeof t != "string")
    throw new TypeError("Parameter 'url' must be a string, not " + typeof t);
  var n = t.indexOf("?"), i = n !== -1 && n < t.indexOf("#") ? "?" : "#", o = t.split(i), a = /\\/g;
  o[0] = o[0].replace(a, "/"), t = o.join(i);
  var s = t;
  if (s = s.trim(), !r && t.split("#").length === 1) {
    var u = rl.exec(s);
    if (u)
      return this.path = s, this.href = s, this.pathname = u[1], u[2] ? (this.search = u[2], e ? this.query = nr.parse(this.search.substr(1)) : this.query = this.search.substr(1)) : e && (this.search = "", this.query = {}), this;
  }
  var l = el.exec(s);
  if (l) {
    l = l[0];
    var p = l.toLowerCase();
    this.protocol = p, s = s.substr(l.length);
  }
  if (r || l || s.match(/^\/\/[^@/]+@[^@/]+/)) {
    var c = s.substr(0, 2) === "//";
    c && !(l && rr[l]) && (s = s.substr(2), this.slashes = !0);
  }
  if (!rr[l] && (c || l && !Me[l])) {
    for (var f = -1, d = 0; d < on.length; d++) {
      var g = s.indexOf(on[d]);
      g !== -1 && (f === -1 || g < f) && (f = g);
    }
    var S, b;
    f === -1 ? b = s.lastIndexOf("@") : b = s.lastIndexOf("@", f), b !== -1 && (S = s.slice(0, b), s = s.slice(b + 1), this.auth = decodeURIComponent(S)), f = -1;
    for (var d = 0; d < nn.length; d++) {
      var g = s.indexOf(nn[d]);
      g !== -1 && (f === -1 || g < f) && (f = g);
    }
    f === -1 && (f = s.length), this.host = s.slice(0, f), s = s.slice(f), this.parseHost(), this.hostname = this.hostname || "";
    var D = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
    if (!D)
      for (var h = this.hostname.split(/\./), d = 0, y = h.length; d < y; d++) {
        var E = h[d];
        if (E && !E.match(an)) {
          for (var $ = "", A = 0, H = E.length; A < H; A++)
            E.charCodeAt(A) > 127 ? $ += "x" : $ += E[A];
          if (!$.match(an)) {
            var O = h.slice(0, d), T = h.slice(d + 1), N = E.match(al);
            N && (O.push(N[1]), T.unshift(N[2])), T.length && (s = "/" + T.join(".") + s), this.hostname = O.join(".");
            break;
          }
        }
      }
    this.hostname.length > ol ? this.hostname = "" : this.hostname = this.hostname.toLowerCase(), D || (this.hostname = Xs.toASCII(this.hostname));
    var re = this.port ? ":" + this.port : "", ne = this.hostname || "";
    this.host = ne + re, this.href += this.host, D && (this.hostname = this.hostname.substr(1, this.hostname.length - 2), s[0] !== "/" && (s = "/" + s));
  }
  if (!sl[p])
    for (var d = 0, y = tr.length; d < y; d++) {
      var z = tr[d];
      if (s.indexOf(z) !== -1) {
        var V = encodeURIComponent(z);
        V === z && (V = escape(z)), s = s.split(z).join(V);
      }
    }
  var G = s.indexOf("#");
  G !== -1 && (this.hash = s.substr(G), s = s.slice(0, G));
  var J = s.indexOf("?");
  if (J !== -1 ? (this.search = s.substr(J), this.query = s.substr(J + 1), e && (this.query = nr.parse(this.query)), s = s.slice(0, J)) : e && (this.search = "", this.query = {}), s && (this.pathname = s), Me[p] && this.hostname && !this.pathname && (this.pathname = "/"), this.pathname || this.search) {
    var re = this.pathname || "", ge = this.search || "";
    this.path = re + ge;
  }
  return this.href = this.format(), this;
};
function ll(t) {
  return typeof t == "string" && (t = Ye(t)), t instanceof te ? t.format() : te.prototype.format.call(t);
}
te.prototype.format = function() {
  var t = this.auth || "";
  t && (t = encodeURIComponent(t), t = t.replace(/%3A/i, ":"), t += "@");
  var e = this.protocol || "", r = this.pathname || "", n = this.hash || "", i = !1, o = "";
  this.host ? i = t + this.host : this.hostname && (i = t + (this.hostname.indexOf(":") === -1 ? this.hostname : "[" + this.hostname + "]"), this.port && (i += ":" + this.port)), this.query && typeof this.query == "object" && Object.keys(this.query).length && (o = nr.stringify(this.query, {
    arrayFormat: "repeat",
    addQueryPrefix: !1
  }));
  var a = this.search || o && "?" + o || "";
  return e && e.substr(-1) !== ":" && (e += ":"), this.slashes || (!e || Me[e]) && i !== !1 ? (i = "//" + (i || ""), r && r.charAt(0) !== "/" && (r = "/" + r)) : i || (i = ""), n && n.charAt(0) !== "#" && (n = "#" + n), a && a.charAt(0) !== "?" && (a = "?" + a), r = r.replace(/[?#]/g, function(s) {
    return encodeURIComponent(s);
  }), a = a.replace("#", "%23"), e + i + r + a + n;
};
function ul(t, e) {
  return Ye(t, !1, !0).resolve(e);
}
te.prototype.resolve = function(t) {
  return this.resolveObject(Ye(t, !1, !0)).format();
};
function pl(t, e) {
  return t ? Ye(t, !1, !0).resolveObject(e) : e;
}
te.prototype.resolveObject = function(t) {
  if (typeof t == "string") {
    var e = new te();
    e.parse(t, !1, !0), t = e;
  }
  for (var r = new te(), n = Object.keys(this), i = 0; i < n.length; i++) {
    var o = n[i];
    r[o] = this[o];
  }
  if (r.hash = t.hash, t.href === "")
    return r.href = r.format(), r;
  if (t.slashes && !t.protocol) {
    for (var a = Object.keys(t), s = 0; s < a.length; s++) {
      var u = a[s];
      u !== "protocol" && (r[u] = t[u]);
    }
    return Me[r.protocol] && r.hostname && !r.pathname && (r.pathname = "/", r.path = r.pathname), r.href = r.format(), r;
  }
  if (t.protocol && t.protocol !== r.protocol) {
    if (!Me[t.protocol]) {
      for (var l = Object.keys(t), p = 0; p < l.length; p++) {
        var c = l[p];
        r[c] = t[c];
      }
      return r.href = r.format(), r;
    }
    if (r.protocol = t.protocol, !t.host && !rr[t.protocol]) {
      for (var y = (t.pathname || "").split("/"); y.length && !(t.host = y.shift()); )
        ;
      t.host || (t.host = ""), t.hostname || (t.hostname = ""), y[0] !== "" && y.unshift(""), y.length < 2 && y.unshift(""), r.pathname = y.join("/");
    } else
      r.pathname = t.pathname;
    if (r.search = t.search, r.query = t.query, r.host = t.host || "", r.auth = t.auth, r.hostname = t.hostname || t.host, r.port = t.port, r.pathname || r.search) {
      var f = r.pathname || "", d = r.search || "";
      r.path = f + d;
    }
    return r.slashes = r.slashes || t.slashes, r.href = r.format(), r;
  }
  var g = r.pathname && r.pathname.charAt(0) === "/", S = t.host || t.pathname && t.pathname.charAt(0) === "/", b = S || g || r.host && t.pathname, D = b, h = r.pathname && r.pathname.split("/") || [], y = t.pathname && t.pathname.split("/") || [], E = r.protocol && !Me[r.protocol];
  if (E && (r.hostname = "", r.port = null, r.host && (h[0] === "" ? h[0] = r.host : h.unshift(r.host)), r.host = "", t.protocol && (t.hostname = null, t.port = null, t.host && (y[0] === "" ? y[0] = t.host : y.unshift(t.host)), t.host = null), b = b && (y[0] === "" || h[0] === "")), S)
    r.host = t.host || t.host === "" ? t.host : r.host, r.hostname = t.hostname || t.hostname === "" ? t.hostname : r.hostname, r.search = t.search, r.query = t.query, h = y;
  else if (y.length)
    h || (h = []), h.pop(), h = h.concat(y), r.search = t.search, r.query = t.query;
  else if (t.search != null) {
    if (E) {
      r.host = h.shift(), r.hostname = r.host;
      var $ = r.host && r.host.indexOf("@") > 0 ? r.host.split("@") : !1;
      $ && (r.auth = $.shift(), r.hostname = $.shift(), r.host = r.hostname);
    }
    return r.search = t.search, r.query = t.query, (r.pathname !== null || r.search !== null) && (r.path = (r.pathname ? r.pathname : "") + (r.search ? r.search : "")), r.href = r.format(), r;
  }
  if (!h.length)
    return r.pathname = null, r.search ? r.path = "/" + r.search : r.path = null, r.href = r.format(), r;
  for (var A = h.slice(-1)[0], H = (r.host || t.host || h.length > 1) && (A === "." || A === "..") || A === "", O = 0, T = h.length; T >= 0; T--)
    A = h[T], A === "." ? h.splice(T, 1) : A === ".." ? (h.splice(T, 1), O++) : O && (h.splice(T, 1), O--);
  if (!b && !D)
    for (; O--; O)
      h.unshift("..");
  b && h[0] !== "" && (!h[0] || h[0].charAt(0) !== "/") && h.unshift(""), H && h.join("/").substr(-1) !== "/" && h.push("");
  var N = h[0] === "" || h[0] && h[0].charAt(0) === "/";
  if (E) {
    r.hostname = N ? "" : h.length ? h.shift() : "", r.host = r.hostname;
    var $ = r.host && r.host.indexOf("@") > 0 ? r.host.split("@") : !1;
    $ && (r.auth = $.shift(), r.hostname = $.shift(), r.host = r.hostname);
  }
  return b = b || r.host && h.length, b && !N && h.unshift(""), h.length > 0 ? r.pathname = h.join("/") : (r.pathname = null, r.path = null), (r.pathname !== null || r.search !== null) && (r.path = (r.pathname ? r.pathname : "") + (r.search ? r.search : "")), r.auth = t.auth || r.auth, r.slashes = r.slashes || t.slashes, r.href = r.format(), r;
};
te.prototype.parseHost = function() {
  var t = this.host, e = tl.exec(t);
  e && (e = e[0], e !== ":" && (this.port = e.substr(1)), t = t.substr(0, t.length - e.length)), t && (this.hostname = t);
};
$e.parse = Ye;
$e.resolve = ul;
$e.resolveObject = pl;
$e.format = ll;
$e.Url = te;
var L = {}, ti = $e, ir = L.ValidationError = function(e, r, n, i, o, a) {
  if (Array.isArray(i) ? (this.path = i, this.property = i.reduce(function(u, l) {
    return u + ri(l);
  }, "instance")) : i !== void 0 && (this.property = i), e && (this.message = e), n) {
    var s = n.$id || n.id;
    this.schema = s || n;
  }
  r !== void 0 && (this.instance = r), this.name = o, this.argument = a, this.stack = this.toString();
};
ir.prototype.toString = function() {
  return this.property + " " + this.message;
};
var _t = L.ValidatorResult = function(e, r, n, i) {
  this.instance = e, this.schema = r, this.options = n, this.path = i.path, this.propertyPath = i.propertyPath, this.errors = [], this.throwError = n && n.throwError, this.throwFirst = n && n.throwFirst, this.throwAll = n && n.throwAll, this.disableFormat = n && n.disableFormat === !0;
};
_t.prototype.addError = function(e) {
  var r;
  if (typeof e == "string")
    r = new ir(e, this.instance, this.schema, this.path);
  else {
    if (!e)
      throw new Error("Missing error detail");
    if (!e.message)
      throw new Error("Missing error message");
    if (!e.name)
      throw new Error("Missing validator type");
    r = new ir(e.message, this.instance, this.schema, this.path, e.name, e.argument);
  }
  if (this.errors.push(r), this.throwFirst)
    throw new Oe(this);
  if (this.throwError)
    throw r;
  return r;
};
_t.prototype.importErrors = function(e) {
  typeof e == "string" || e && e.validatorType ? this.addError(e) : e && e.errors && (this.errors = this.errors.concat(e.errors));
};
function fl(t, e) {
  return e + ": " + t.toString() + `
`;
}
_t.prototype.toString = function(e) {
  return this.errors.map(fl).join("");
};
Object.defineProperty(_t.prototype, "valid", { get: function() {
  return !this.errors.length;
} });
L.ValidatorResultError = Oe;
function Oe(t) {
  Error.captureStackTrace && Error.captureStackTrace(this, Oe), this.instance = t.instance, this.schema = t.schema, this.options = t.options, this.errors = t.errors;
}
Oe.prototype = new Error();
Oe.prototype.constructor = Oe;
Oe.prototype.name = "Validation Error";
var sn = L.SchemaError = function t(e, r) {
  this.message = e, this.schema = r, Error.call(this, e), Error.captureStackTrace(this, t);
};
sn.prototype = Object.create(
  Error.prototype,
  {
    constructor: { value: sn, enumerable: !1 },
    name: { value: "SchemaError", enumerable: !1 }
  }
);
var or = L.SchemaContext = function(e, r, n, i, o) {
  this.schema = e, this.options = r, Array.isArray(n) ? (this.path = n, this.propertyPath = n.reduce(function(a, s) {
    return a + ri(s);
  }, "instance")) : this.propertyPath = n, this.base = i, this.schemas = o;
};
or.prototype.resolve = function(e) {
  return ti.resolve(this.base, e);
};
or.prototype.makeChild = function(e, r) {
  var n = r === void 0 ? this.path : this.path.concat([r]), i = e.$id || e.id, o = ti.resolve(this.base, i || ""), a = new or(e, this.options, n, o, Object.create(this.schemas));
  return i && !a.schemas[o] && (a.schemas[o] = e), a;
};
var ae = L.FORMAT_REGEXPS = {
  // 7.3.1. Dates, Times, and Duration
  "date-time": /^\d{4}-(?:0[0-9]{1}|1[0-2]{1})-(3[01]|0[1-9]|[12][0-9])[tT ](2[0-4]|[01][0-9]):([0-5][0-9]):(60|[0-5][0-9])(\.\d+)?([zZ]|[+-]([0-5][0-9]):(60|[0-5][0-9]))$/,
  date: /^\d{4}-(?:0[0-9]{1}|1[0-2]{1})-(3[01]|0[1-9]|[12][0-9])$/,
  time: /^(2[0-4]|[01][0-9]):([0-5][0-9]):(60|[0-5][0-9])$/,
  duration: /P(T\d+(H(\d+M(\d+S)?)?|M(\d+S)?|S)|\d+(D|M(\d+D)?|Y(\d+M(\d+D)?)?)(T\d+(H(\d+M(\d+S)?)?|M(\d+S)?|S))?|\d+W)/i,
  // 7.3.2. Email Addresses
  // TODO: fix the email production
  email: /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/,
  "idn-email": /^("(?:[!#-\[\]-\u{10FFFF}]|\\[\t -\u{10FFFF}])*"|[!#-'*+\-/-9=?A-Z\^-\u{10FFFF}](?:\.?[!#-'*+\-/-9=?A-Z\^-\u{10FFFF}])*)@([!#-'*+\-/-9=?A-Z\^-\u{10FFFF}](?:\.?[!#-'*+\-/-9=?A-Z\^-\u{10FFFF}])*|\[[!-Z\^-\u{10FFFF}]*\])$/u,
  // 7.3.3. Hostnames
  // 7.3.4. IP Addresses
  "ip-address": /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  // FIXME whitespace is invalid
  ipv6: /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/,
  // 7.3.5. Resource Identifiers
  // TODO: A more accurate regular expression for "uri" goes:
  // [A-Za-z][+\-.0-9A-Za-z]*:((/(/((%[0-9A-Fa-f]{2}|[!$&-.0-9;=A-Z_a-z~])+|(\[(([Vv][0-9A-Fa-f]+\.[!$&-.0-;=A-Z_a-z~]+)?|[.0-:A-Fa-f]+)\])?)(:\d*)?)?)?#(%[0-9A-Fa-f]{2}|[!$&-;=?-Z_a-z~])*|(/(/((%[0-9A-Fa-f]{2}|[!$&-.0-9;=A-Z_a-z~])+|(\[(([Vv][0-9A-Fa-f]+\.[!$&-.0-;=A-Z_a-z~]+)?|[.0-:A-Fa-f]+)\])?)(:\d*)?[/?]|[!$&-.0-;=?-Z_a-z~])|/?%[0-9A-Fa-f]{2}|[!$&-.0-;=?-Z_a-z~])(%[0-9A-Fa-f]{2}|[!$&-;=?-Z_a-z~])*(#(%[0-9A-Fa-f]{2}|[!$&-;=?-Z_a-z~])*)?|/(/((%[0-9A-Fa-f]{2}|[!$&-.0-9;=A-Z_a-z~])+(:\d*)?|(\[(([Vv][0-9A-Fa-f]+\.[!$&-.0-;=A-Z_a-z~]+)?|[.0-:A-Fa-f]+)\])?:\d*|\[(([Vv][0-9A-Fa-f]+\.[!$&-.0-;=A-Z_a-z~]+)?|[.0-:A-Fa-f]+)\])?)?)?
  uri: /^[a-zA-Z][a-zA-Z0-9+.-]*:[^\s]*$/,
  "uri-reference": /^(((([A-Za-z][+\-.0-9A-Za-z]*(:%[0-9A-Fa-f]{2}|:[!$&-.0-;=?-Z_a-z~]|[/?])|\?)(%[0-9A-Fa-f]{2}|[!$&-;=?-Z_a-z~])*|([A-Za-z][+\-.0-9A-Za-z]*:?)?)|([A-Za-z][+\-.0-9A-Za-z]*:)?\/((%[0-9A-Fa-f]{2}|\/((%[0-9A-Fa-f]{2}|[!$&-.0-9;=A-Z_a-z~])+|(\[(([Vv][0-9A-Fa-f]+\.[!$&-.0-;=A-Z_a-z~]+)?|[.0-:A-Fa-f]+)\])?)(:\d*)?[/?]|[!$&-.0-;=?-Z_a-z~])(%[0-9A-Fa-f]{2}|[!$&-;=?-Z_a-z~])*|(\/((%[0-9A-Fa-f]{2}|[!$&-.0-9;=A-Z_a-z~])+|(\[(([Vv][0-9A-Fa-f]+\.[!$&-.0-;=A-Z_a-z~]+)?|[.0-:A-Fa-f]+)\])?)(:\d*)?)?))#(%[0-9A-Fa-f]{2}|[!$&-;=?-Z_a-z~])*|(([A-Za-z][+\-.0-9A-Za-z]*)?%[0-9A-Fa-f]{2}|[!$&-.0-9;=@_~]|[A-Za-z][+\-.0-9A-Za-z]*[!$&-*,;=@_~])(%[0-9A-Fa-f]{2}|[!$&-.0-9;=@-Z_a-z~])*((([/?](%[0-9A-Fa-f]{2}|[!$&-;=?-Z_a-z~])*)?#|[/?])(%[0-9A-Fa-f]{2}|[!$&-;=?-Z_a-z~])*)?|([A-Za-z][+\-.0-9A-Za-z]*(:%[0-9A-Fa-f]{2}|:[!$&-.0-;=?-Z_a-z~]|[/?])|\?)(%[0-9A-Fa-f]{2}|[!$&-;=?-Z_a-z~])*|([A-Za-z][+\-.0-9A-Za-z]*:)?\/((%[0-9A-Fa-f]{2}|\/((%[0-9A-Fa-f]{2}|[!$&-.0-9;=A-Z_a-z~])+|(\[(([Vv][0-9A-Fa-f]+\.[!$&-.0-;=A-Z_a-z~]+)?|[.0-:A-Fa-f]+)\])?)(:\d*)?[/?]|[!$&-.0-;=?-Z_a-z~])(%[0-9A-Fa-f]{2}|[!$&-;=?-Z_a-z~])*|\/((%[0-9A-Fa-f]{2}|[!$&-.0-9;=A-Z_a-z~])+(:\d*)?|(\[(([Vv][0-9A-Fa-f]+\.[!$&-.0-;=A-Z_a-z~]+)?|[.0-:A-Fa-f]+)\])?:\d*|\[(([Vv][0-9A-Fa-f]+\.[!$&-.0-;=A-Z_a-z~]+)?|[.0-:A-Fa-f]+)\])?)?|[A-Za-z][+\-.0-9A-Za-z]*:?)?$/,
  iri: /^[a-zA-Z][a-zA-Z0-9+.-]*:[^\s]*$/,
  "iri-reference": /^(((([A-Za-z][+\-.0-9A-Za-z]*(:%[0-9A-Fa-f]{2}|:[!$&-.0-;=?-Z_a-z~-\u{10FFFF}]|[/?])|\?)(%[0-9A-Fa-f]{2}|[!$&-;=?-Z_a-z~-\u{10FFFF}])*|([A-Za-z][+\-.0-9A-Za-z]*:?)?)|([A-Za-z][+\-.0-9A-Za-z]*:)?\/((%[0-9A-Fa-f]{2}|\/((%[0-9A-Fa-f]{2}|[!$&-.0-9;=A-Z_a-z~-\u{10FFFF}])+|(\[(([Vv][0-9A-Fa-f]+\.[!$&-.0-;=A-Z_a-z~-\u{10FFFF}]+)?|[.0-:A-Fa-f]+)\])?)(:\d*)?[/?]|[!$&-.0-;=?-Z_a-z~-\u{10FFFF}])(%[0-9A-Fa-f]{2}|[!$&-;=?-Z_a-z~-\u{10FFFF}])*|(\/((%[0-9A-Fa-f]{2}|[!$&-.0-9;=A-Z_a-z~-\u{10FFFF}])+|(\[(([Vv][0-9A-Fa-f]+\.[!$&-.0-;=A-Z_a-z~-\u{10FFFF}]+)?|[.0-:A-Fa-f]+)\])?)(:\d*)?)?))#(%[0-9A-Fa-f]{2}|[!$&-;=?-Z_a-z~-\u{10FFFF}])*|(([A-Za-z][+\-.0-9A-Za-z]*)?%[0-9A-Fa-f]{2}|[!$&-.0-9;=@_~-\u{10FFFF}]|[A-Za-z][+\-.0-9A-Za-z]*[!$&-*,;=@_~-\u{10FFFF}])(%[0-9A-Fa-f]{2}|[!$&-.0-9;=@-Z_a-z~-\u{10FFFF}])*((([/?](%[0-9A-Fa-f]{2}|[!$&-;=?-Z_a-z~-\u{10FFFF}])*)?#|[/?])(%[0-9A-Fa-f]{2}|[!$&-;=?-Z_a-z~-\u{10FFFF}])*)?|([A-Za-z][+\-.0-9A-Za-z]*(:%[0-9A-Fa-f]{2}|:[!$&-.0-;=?-Z_a-z~-\u{10FFFF}]|[/?])|\?)(%[0-9A-Fa-f]{2}|[!$&-;=?-Z_a-z~-\u{10FFFF}])*|([A-Za-z][+\-.0-9A-Za-z]*:)?\/((%[0-9A-Fa-f]{2}|\/((%[0-9A-Fa-f]{2}|[!$&-.0-9;=A-Z_a-z~-\u{10FFFF}])+|(\[(([Vv][0-9A-Fa-f]+\.[!$&-.0-;=A-Z_a-z~-\u{10FFFF}]+)?|[.0-:A-Fa-f]+)\])?)(:\d*)?[/?]|[!$&-.0-;=?-Z_a-z~-\u{10FFFF}])(%[0-9A-Fa-f]{2}|[!$&-;=?-Z_a-z~-\u{10FFFF}])*|\/((%[0-9A-Fa-f]{2}|[!$&-.0-9;=A-Z_a-z~-\u{10FFFF}])+(:\d*)?|(\[(([Vv][0-9A-Fa-f]+\.[!$&-.0-;=A-Z_a-z~-\u{10FFFF}]+)?|[.0-:A-Fa-f]+)\])?:\d*|\[(([Vv][0-9A-Fa-f]+\.[!$&-.0-;=A-Z_a-z~-\u{10FFFF}]+)?|[.0-:A-Fa-f]+)\])?)?|[A-Za-z][+\-.0-9A-Za-z]*:?)?$/u,
  uuid: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
  // 7.3.6. uri-template
  "uri-template": /(%[0-9a-f]{2}|[!#$&(-;=?@\[\]_a-z~]|\{[!#&+,./;=?@|]?(%[0-9a-f]{2}|[0-9_a-z])(\.?(%[0-9a-f]{2}|[0-9_a-z]))*(:[1-9]\d{0,3}|\*)?(,(%[0-9a-f]{2}|[0-9_a-z])(\.?(%[0-9a-f]{2}|[0-9_a-z]))*(:[1-9]\d{0,3}|\*)?)*\})*/iu,
  // 7.3.7. JSON Pointers
  "json-pointer": /^(\/([\x00-\x2e0-@\[-}\x7f]|~[01])*)*$/iu,
  "relative-json-pointer": /^\d+(#|(\/([\x00-\x2e0-@\[-}\x7f]|~[01])*)*)$/iu,
  // hostname regex from: http://stackoverflow.com/a/1420225/5628
  hostname: /^(?=.{1,255}$)[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?)*\.?$/,
  "host-name": /^(?=.{1,255}$)[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?)*\.?$/,
  "utc-millisec": function(t) {
    return typeof t == "string" && parseFloat(t) === parseInt(t, 10) && !isNaN(t);
  },
  // 7.3.8. regex
  regex: function(t) {
    var e = !0;
    try {
      new RegExp(t);
    } catch {
      e = !1;
    }
    return e;
  },
  // Other definitions
  // "style" was removed from JSON Schema in draft-4 and is deprecated
  style: /[\r\n\t ]*[^\r\n\t ][^:]*:[\r\n\t ]*[^\r\n\t ;]*[\r\n\t ]*;?/,
  // "color" was removed from JSON Schema in draft-4 and is deprecated
  color: /^(#?([0-9A-Fa-f]{3}){1,2}\b|aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow|(rgb\(\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*\))|(rgb\(\s*(\d?\d%|100%)+\s*,\s*(\d?\d%|100%)+\s*,\s*(\d?\d%|100%)+\s*\)))$/,
  phone: /^\+(?:[0-9] ?){6,14}[0-9]$/,
  alpha: /^[a-zA-Z]+$/,
  alphanumeric: /^[a-zA-Z0-9]+$/
};
ae.regexp = ae.regex;
ae.pattern = ae.regex;
ae.ipv4 = ae["ip-address"];
L.isFormat = function(e, r, n) {
  if (typeof e == "string" && ae[r] !== void 0) {
    if (ae[r] instanceof RegExp)
      return ae[r].test(e);
    if (typeof ae[r] == "function")
      return ae[r](e);
  } else if (n && n.customFormats && typeof n.customFormats[r] == "function")
    return n.customFormats[r](e);
  return !0;
};
var ri = L.makeSuffix = function(e) {
  return e = e.toString(), !e.match(/[.\s\[\]]/) && !e.match(/^[\d]/) ? "." + e : e.match(/^\d+$/) ? "[" + e + "]" : "[" + JSON.stringify(e) + "]";
};
L.deepCompareStrict = function t(e, r) {
  if (typeof e != typeof r)
    return !1;
  if (Array.isArray(e))
    return !Array.isArray(r) || e.length !== r.length ? !1 : e.every(function(o, a) {
      return t(e[a], r[a]);
    });
  if (typeof e == "object") {
    if (!e || !r)
      return e === r;
    var n = Object.keys(e), i = Object.keys(r);
    return n.length !== i.length ? !1 : n.every(function(o) {
      return t(e[o], r[o]);
    });
  }
  return e === r;
};
function cl(t, e, r, n) {
  typeof r == "object" ? e[n] = wr(t[n], r) : t.indexOf(r) === -1 && e.push(r);
}
function dl(t, e, r) {
  e[r] = t[r];
}
function hl(t, e, r, n) {
  typeof e[n] != "object" || !e[n] ? r[n] = e[n] : t[n] ? r[n] = wr(t[n], e[n]) : r[n] = e[n];
}
function wr(t, e) {
  var r = Array.isArray(e), n = r && [] || {};
  return r ? (t = t || [], n = n.concat(t), e.forEach(cl.bind(null, t, n))) : (t && typeof t == "object" && Object.keys(t).forEach(dl.bind(null, t, n)), Object.keys(e).forEach(hl.bind(null, t, e, n))), n;
}
L.deepMerge = wr;
L.objectGetPath = function(e, r) {
  for (var n = r.split("/").slice(1), i; typeof (i = n.shift()) == "string"; ) {
    var o = decodeURIComponent(i.replace(/~0/, "~").replace(/~1/g, "/"));
    if (!(o in e))
      return;
    e = e[o];
  }
  return e;
};
function yl(t) {
  return "/" + encodeURIComponent(t).replace(/~/g, "%7E");
}
L.encodePath = function(e) {
  return e.map(yl).join("");
};
L.getDecimalPlaces = function(e) {
  var r = 0;
  if (isNaN(e))
    return r;
  typeof e != "number" && (e = Number(e));
  var n = e.toString().split("e");
  if (n.length === 2) {
    if (n[1][0] !== "-")
      return r;
    r = Number(n[1].slice(1));
  }
  var i = n[0].split(".");
  return i.length === 2 && (r += i[1].length), r;
};
L.isSchema = function(e) {
  return typeof e == "object" && e || typeof e == "boolean";
};
var X = L, _ = X.ValidatorResult, _e = X.SchemaError, vr = {};
vr.ignoreProperties = {
  // informative properties
  id: !0,
  default: !0,
  description: !0,
  title: !0,
  // arguments to other properties
  additionalItems: !0,
  then: !0,
  else: !0,
  // special-handled properties
  $schema: !0,
  $ref: !0,
  extends: !0
};
var P = vr.validators = {};
P.type = function(e, r, n, i) {
  if (e === void 0)
    return null;
  var o = new _(e, r, n, i), a = Array.isArray(r.type) ? r.type : [r.type];
  if (!a.some(this.testType.bind(this, e, r, n, i))) {
    var s = a.map(function(u) {
      if (u) {
        var l = u.$id || u.id;
        return l ? "<" + l + ">" : u + "";
      }
    });
    o.addError({
      name: "type",
      argument: s,
      message: "is not of a type(s) " + s
    });
  }
  return o;
};
function br(t, e, r, n, i) {
  var o = e.throwError, a = e.throwAll;
  e.throwError = !1, e.throwAll = !1;
  var s = this.validateSchema(t, i, e, r);
  return e.throwError = o, e.throwAll = a, !s.valid && n instanceof Function && n(s), s.valid;
}
P.anyOf = function(e, r, n, i) {
  if (e === void 0)
    return null;
  var o = new _(e, r, n, i), a = new _(e, r, n, i);
  if (!Array.isArray(r.anyOf))
    throw new _e("anyOf must be an array");
  if (!r.anyOf.some(
    br.bind(
      this,
      e,
      n,
      i,
      function(u) {
        a.importErrors(u);
      }
    )
  )) {
    var s = r.anyOf.map(function(u, l) {
      var p = u.$id || u.id;
      return p ? "<" + p + ">" : u.title && JSON.stringify(u.title) || u.$ref && "<" + u.$ref + ">" || "[subschema " + l + "]";
    });
    n.nestedErrors && o.importErrors(a), o.addError({
      name: "anyOf",
      argument: s,
      message: "is not any of " + s.join(",")
    });
  }
  return o;
};
P.allOf = function(e, r, n, i) {
  if (e === void 0)
    return null;
  if (!Array.isArray(r.allOf))
    throw new _e("allOf must be an array");
  var o = new _(e, r, n, i), a = this;
  return r.allOf.forEach(function(s, u) {
    var l = a.validateSchema(e, s, n, i);
    if (!l.valid) {
      var p = s.$id || s.id, c = p || s.title && JSON.stringify(s.title) || s.$ref && "<" + s.$ref + ">" || "[subschema " + u + "]";
      o.addError({
        name: "allOf",
        argument: { id: c, length: l.errors.length, valid: l },
        message: "does not match allOf schema " + c + " with " + l.errors.length + " error[s]:"
      }), o.importErrors(l);
    }
  }), o;
};
P.oneOf = function(e, r, n, i) {
  if (e === void 0)
    return null;
  if (!Array.isArray(r.oneOf))
    throw new _e("oneOf must be an array");
  var o = new _(e, r, n, i), a = new _(e, r, n, i), s = r.oneOf.filter(
    br.bind(
      this,
      e,
      n,
      i,
      function(l) {
        a.importErrors(l);
      }
    )
  ).length, u = r.oneOf.map(function(l, p) {
    var c = l.$id || l.id;
    return c || l.title && JSON.stringify(l.title) || l.$ref && "<" + l.$ref + ">" || "[subschema " + p + "]";
  });
  return s !== 1 && (n.nestedErrors && o.importErrors(a), o.addError({
    name: "oneOf",
    argument: u,
    message: "is not exactly one from " + u.join(",")
  })), o;
};
P.if = function(e, r, n, i) {
  if (e === void 0)
    return null;
  if (!X.isSchema(r.if))
    throw new Error('Expected "if" keyword to be a schema');
  var o = br.call(this, e, n, i, null, r.if), a = new _(e, r, n, i), s;
  if (o) {
    if (r.then === void 0)
      return;
    if (!X.isSchema(r.then))
      throw new Error('Expected "then" keyword to be a schema');
    s = this.validateSchema(e, r.then, n, i.makeChild(r.then)), a.importErrors(s);
  } else {
    if (r.else === void 0)
      return;
    if (!X.isSchema(r.else))
      throw new Error('Expected "else" keyword to be a schema');
    s = this.validateSchema(e, r.else, n, i.makeChild(r.else)), a.importErrors(s);
  }
  return a;
};
function $r(t, e) {
  if (Object.hasOwnProperty.call(t, e))
    return t[e];
  if (e in t) {
    for (; t = Object.getPrototypeOf(t); )
      if (Object.propertyIsEnumerable.call(t, e))
        return t[e];
  }
}
P.propertyNames = function(e, r, n, i) {
  if (this.types.object(e)) {
    var o = new _(e, r, n, i), a = r.propertyNames !== void 0 ? r.propertyNames : {};
    if (!X.isSchema(a))
      throw new _e('Expected "propertyNames" to be a schema (object or boolean)');
    for (var s in e)
      if ($r(e, s) !== void 0) {
        var u = this.validateSchema(s, a, n, i.makeChild(a));
        o.importErrors(u);
      }
    return o;
  }
};
P.properties = function(e, r, n, i) {
  if (this.types.object(e)) {
    var o = new _(e, r, n, i), a = r.properties || {};
    for (var s in a) {
      var u = a[s];
      if (u !== void 0) {
        if (u === null)
          throw new _e('Unexpected null, expected schema in "properties"');
        typeof n.preValidateProperty == "function" && n.preValidateProperty(e, s, u, n, i);
        var l = $r(e, s), p = this.validateSchema(l, u, n, i.makeChild(u, s));
        p.instance !== o.instance[s] && (o.instance[s] = p.instance), o.importErrors(p);
      }
    }
    return o;
  }
};
function ni(t, e, r, n, i, o) {
  if (this.types.object(t) && !(e.properties && e.properties[i] !== void 0))
    if (e.additionalProperties === !1)
      o.addError({
        name: "additionalProperties",
        argument: i,
        message: "is not allowed to have the additional property " + JSON.stringify(i)
      });
    else {
      var a = e.additionalProperties || {};
      typeof r.preValidateProperty == "function" && r.preValidateProperty(t, i, a, r, n);
      var s = this.validateSchema(t[i], a, r, n.makeChild(a, i));
      s.instance !== o.instance[i] && (o.instance[i] = s.instance), o.importErrors(s);
    }
}
P.patternProperties = function(e, r, n, i) {
  if (this.types.object(e)) {
    var o = new _(e, r, n, i), a = r.patternProperties || {};
    for (var s in e) {
      var u = !0;
      for (var l in a) {
        var p = a[l];
        if (p !== void 0) {
          if (p === null)
            throw new _e('Unexpected null, expected schema in "patternProperties"');
          try {
            var c = new RegExp(l, "u");
          } catch {
            c = new RegExp(l);
          }
          if (c.test(s)) {
            u = !1, typeof n.preValidateProperty == "function" && n.preValidateProperty(e, s, p, n, i);
            var f = this.validateSchema(e[s], p, n, i.makeChild(p, s));
            f.instance !== o.instance[s] && (o.instance[s] = f.instance), o.importErrors(f);
          }
        }
      }
      u && ni.call(this, e, r, n, i, s, o);
    }
    return o;
  }
};
P.additionalProperties = function(e, r, n, i) {
  if (this.types.object(e)) {
    if (r.patternProperties)
      return null;
    var o = new _(e, r, n, i);
    for (var a in e)
      ni.call(this, e, r, n, i, a, o);
    return o;
  }
};
P.minProperties = function(e, r, n, i) {
  if (this.types.object(e)) {
    var o = new _(e, r, n, i), a = Object.keys(e);
    return a.length >= r.minProperties || o.addError({
      name: "minProperties",
      argument: r.minProperties,
      message: "does not meet minimum property length of " + r.minProperties
    }), o;
  }
};
P.maxProperties = function(e, r, n, i) {
  if (this.types.object(e)) {
    var o = new _(e, r, n, i), a = Object.keys(e);
    return a.length <= r.maxProperties || o.addError({
      name: "maxProperties",
      argument: r.maxProperties,
      message: "does not meet maximum property length of " + r.maxProperties
    }), o;
  }
};
P.items = function(e, r, n, i) {
  var o = this;
  if (this.types.array(e) && r.items !== void 0) {
    var a = new _(e, r, n, i);
    return e.every(function(s, u) {
      if (Array.isArray(r.items))
        var l = r.items[u] === void 0 ? r.additionalItems : r.items[u];
      else
        var l = r.items;
      if (l === void 0)
        return !0;
      if (l === !1)
        return a.addError({
          name: "items",
          message: "additionalItems not permitted"
        }), !1;
      var p = o.validateSchema(s, l, n, i.makeChild(l, u));
      return p.instance !== a.instance[u] && (a.instance[u] = p.instance), a.importErrors(p), !0;
    }), a;
  }
};
P.contains = function(e, r, n, i) {
  var o = this;
  if (this.types.array(e) && r.contains !== void 0) {
    if (!X.isSchema(r.contains))
      throw new Error('Expected "contains" keyword to be a schema');
    var a = new _(e, r, n, i), s = e.some(function(u, l) {
      var p = o.validateSchema(u, r.contains, n, i.makeChild(r.contains, l));
      return p.errors.length === 0;
    });
    return s === !1 && a.addError({
      name: "contains",
      argument: r.contains,
      message: "must contain an item matching given schema"
    }), a;
  }
};
P.minimum = function(e, r, n, i) {
  if (this.types.number(e)) {
    var o = new _(e, r, n, i);
    return r.exclusiveMinimum && r.exclusiveMinimum === !0 ? e > r.minimum || o.addError({
      name: "minimum",
      argument: r.minimum,
      message: "must be greater than " + r.minimum
    }) : e >= r.minimum || o.addError({
      name: "minimum",
      argument: r.minimum,
      message: "must be greater than or equal to " + r.minimum
    }), o;
  }
};
P.maximum = function(e, r, n, i) {
  if (this.types.number(e)) {
    var o = new _(e, r, n, i);
    return r.exclusiveMaximum && r.exclusiveMaximum === !0 ? e < r.maximum || o.addError({
      name: "maximum",
      argument: r.maximum,
      message: "must be less than " + r.maximum
    }) : e <= r.maximum || o.addError({
      name: "maximum",
      argument: r.maximum,
      message: "must be less than or equal to " + r.maximum
    }), o;
  }
};
P.exclusiveMinimum = function(e, r, n, i) {
  if (typeof r.exclusiveMinimum != "boolean" && this.types.number(e)) {
    var o = new _(e, r, n, i), a = e > r.exclusiveMinimum;
    return a || o.addError({
      name: "exclusiveMinimum",
      argument: r.exclusiveMinimum,
      message: "must be strictly greater than " + r.exclusiveMinimum
    }), o;
  }
};
P.exclusiveMaximum = function(e, r, n, i) {
  if (typeof r.exclusiveMaximum != "boolean" && this.types.number(e)) {
    var o = new _(e, r, n, i), a = e < r.exclusiveMaximum;
    return a || o.addError({
      name: "exclusiveMaximum",
      argument: r.exclusiveMaximum,
      message: "must be strictly less than " + r.exclusiveMaximum
    }), o;
  }
};
var ii = function(e, r, n, i, o, a) {
  if (this.types.number(e)) {
    var s = r[o];
    if (s == 0)
      throw new _e(o + " cannot be zero");
    var u = new _(e, r, n, i), l = X.getDecimalPlaces(e), p = X.getDecimalPlaces(s), c = Math.max(l, p), f = Math.pow(10, c);
    return Math.round(e * f) % Math.round(s * f) !== 0 && u.addError({
      name: o,
      argument: s,
      message: a + JSON.stringify(s)
    }), u;
  }
};
P.multipleOf = function(e, r, n, i) {
  return ii.call(this, e, r, n, i, "multipleOf", "is not a multiple of (divisible by) ");
};
P.divisibleBy = function(e, r, n, i) {
  return ii.call(this, e, r, n, i, "divisibleBy", "is not divisible by (multiple of) ");
};
P.required = function(e, r, n, i) {
  var o = new _(e, r, n, i);
  return e === void 0 && r.required === !0 ? o.addError({
    name: "required",
    message: "is required"
  }) : this.types.object(e) && Array.isArray(r.required) && r.required.forEach(function(a) {
    $r(e, a) === void 0 && o.addError({
      name: "required",
      argument: a,
      message: "requires property " + JSON.stringify(a)
    });
  }), o;
};
P.pattern = function(e, r, n, i) {
  if (this.types.string(e)) {
    var o = new _(e, r, n, i), a = r.pattern;
    try {
      var s = new RegExp(a, "u");
    } catch {
      s = new RegExp(a);
    }
    return e.match(s) || o.addError({
      name: "pattern",
      argument: r.pattern,
      message: "does not match pattern " + JSON.stringify(r.pattern.toString())
    }), o;
  }
};
P.format = function(e, r, n, i) {
  if (e !== void 0) {
    var o = new _(e, r, n, i);
    return !o.disableFormat && !X.isFormat(e, r.format, this) && o.addError({
      name: "format",
      argument: r.format,
      message: "does not conform to the " + JSON.stringify(r.format) + " format"
    }), o;
  }
};
P.minLength = function(e, r, n, i) {
  if (this.types.string(e)) {
    var o = new _(e, r, n, i), a = e.match(/[\uDC00-\uDFFF]/g), s = e.length - (a ? a.length : 0);
    return s >= r.minLength || o.addError({
      name: "minLength",
      argument: r.minLength,
      message: "does not meet minimum length of " + r.minLength
    }), o;
  }
};
P.maxLength = function(e, r, n, i) {
  if (this.types.string(e)) {
    var o = new _(e, r, n, i), a = e.match(/[\uDC00-\uDFFF]/g), s = e.length - (a ? a.length : 0);
    return s <= r.maxLength || o.addError({
      name: "maxLength",
      argument: r.maxLength,
      message: "does not meet maximum length of " + r.maxLength
    }), o;
  }
};
P.minItems = function(e, r, n, i) {
  if (this.types.array(e)) {
    var o = new _(e, r, n, i);
    return e.length >= r.minItems || o.addError({
      name: "minItems",
      argument: r.minItems,
      message: "does not meet minimum length of " + r.minItems
    }), o;
  }
};
P.maxItems = function(e, r, n, i) {
  if (this.types.array(e)) {
    var o = new _(e, r, n, i);
    return e.length <= r.maxItems || o.addError({
      name: "maxItems",
      argument: r.maxItems,
      message: "does not meet maximum length of " + r.maxItems
    }), o;
  }
};
function ml(t, e, r) {
  var n, i = r.length;
  for (n = e + 1, i; n < i; n++)
    if (X.deepCompareStrict(t, r[n]))
      return !1;
  return !0;
}
P.uniqueItems = function(e, r, n, i) {
  if (r.uniqueItems === !0 && this.types.array(e)) {
    var o = new _(e, r, n, i);
    return e.every(ml) || o.addError({
      name: "uniqueItems",
      message: "contains duplicate item"
    }), o;
  }
};
P.dependencies = function(e, r, n, i) {
  if (this.types.object(e)) {
    var o = new _(e, r, n, i);
    for (var a in r.dependencies)
      if (e[a] !== void 0) {
        var s = r.dependencies[a], u = i.makeChild(s, a);
        if (typeof s == "string" && (s = [s]), Array.isArray(s))
          s.forEach(function(p) {
            e[p] === void 0 && o.addError({
              // FIXME there's two different "dependencies" errors here with slightly different outputs
              // Can we make these the same? Or should we create different error types?
              name: "dependencies",
              argument: u.propertyPath,
              message: "property " + p + " not found, required by " + u.propertyPath
            });
          });
        else {
          var l = this.validateSchema(e, s, n, u);
          o.instance !== l.instance && (o.instance = l.instance), l && l.errors.length && (o.addError({
            name: "dependencies",
            argument: u.propertyPath,
            message: "does not meet dependency required by " + u.propertyPath
          }), o.importErrors(l));
        }
      }
    return o;
  }
};
P.enum = function(e, r, n, i) {
  if (e === void 0)
    return null;
  if (!Array.isArray(r.enum))
    throw new _e("enum expects an array", r);
  var o = new _(e, r, n, i);
  return r.enum.some(X.deepCompareStrict.bind(null, e)) || o.addError({
    name: "enum",
    argument: r.enum,
    message: "is not one of enum values: " + r.enum.map(String).join(",")
  }), o;
};
P.const = function(e, r, n, i) {
  if (e === void 0)
    return null;
  var o = new _(e, r, n, i);
  return X.deepCompareStrict(r.const, e) || o.addError({
    name: "const",
    argument: r.const,
    message: "does not exactly match expected constant: " + r.const
  }), o;
};
P.not = P.disallow = function(e, r, n, i) {
  var o = this;
  if (e === void 0)
    return null;
  var a = new _(e, r, n, i), s = r.not || r.disallow;
  return s ? (Array.isArray(s) || (s = [s]), s.forEach(function(u) {
    if (o.testType(e, r, n, i, u)) {
      var l = u && (u.$id || u.id), p = l || u;
      a.addError({
        name: "not",
        argument: p,
        message: "is of prohibited type " + p
      });
    }
  }), a) : null;
};
var gl = vr, Er = {}, ln = $e, wl = L;
Er.SchemaScanResult = oi;
function oi(t, e) {
  this.id = t, this.ref = e;
}
Er.scan = function(e, r) {
  function n(u, l) {
    if (!(!l || typeof l != "object")) {
      if (l.$ref) {
        var p = ln.resolve(u, l.$ref);
        s[p] = s[p] ? s[p] + 1 : 0;
        return;
      }
      var c = l.$id || l.id, f = c ? ln.resolve(u, c) : u;
      if (f) {
        if (f.indexOf("#") < 0 && (f += "#"), a[f]) {
          if (!wl.deepCompareStrict(a[f], l))
            throw new Error("Schema <" + f + "> already exists with different definition");
          return a[f];
        }
        a[f] = l, f[f.length - 1] == "#" && (a[f.substring(0, f.length - 1)] = l);
      }
      i(f + "/items", Array.isArray(l.items) ? l.items : [l.items]), i(f + "/extends", Array.isArray(l.extends) ? l.extends : [l.extends]), n(f + "/additionalItems", l.additionalItems), o(f + "/properties", l.properties), n(f + "/additionalProperties", l.additionalProperties), o(f + "/definitions", l.definitions), o(f + "/patternProperties", l.patternProperties), o(f + "/dependencies", l.dependencies), i(f + "/disallow", l.disallow), i(f + "/allOf", l.allOf), i(f + "/anyOf", l.anyOf), i(f + "/oneOf", l.oneOf), n(f + "/not", l.not);
    }
  }
  function i(u, l) {
    if (Array.isArray(l))
      for (var p = 0; p < l.length; p++)
        n(u + "/" + p, l[p]);
  }
  function o(u, l) {
    if (!(!l || typeof l != "object"))
      for (var p in l)
        n(u + "/" + p, l[p]);
  }
  var a = {}, s = {};
  return n(e, r), new oi(a, s);
};
var ai = $e, si = gl, Re = L, li = Er.scan, ui = Re.ValidatorResult, vl = Re.ValidatorResultError, Qe = Re.SchemaError, pi = Re.SchemaContext, fi = "/", W = function t() {
  this.customFormats = Object.create(t.prototype.customFormats), this.schemas = {}, this.unresolvedRefs = [], this.types = Object.create(he), this.attributes = Object.create(si.validators);
};
W.prototype.customFormats = {};
W.prototype.schemas = null;
W.prototype.types = null;
W.prototype.attributes = null;
W.prototype.unresolvedRefs = null;
W.prototype.addSchema = function(e, r) {
  var n = this;
  if (!e)
    return null;
  var i = li(r || fi, e), o = r || e.$id || e.id;
  for (var a in i.id)
    this.schemas[a] = i.id[a];
  for (var a in i.ref)
    this.unresolvedRefs.push(a);
  return this.unresolvedRefs = this.unresolvedRefs.filter(function(s) {
    return typeof n.schemas[s] > "u";
  }), this.schemas[o];
};
W.prototype.addSubSchemaArray = function(e, r) {
  if (Array.isArray(r))
    for (var n = 0; n < r.length; n++)
      this.addSubSchema(e, r[n]);
};
W.prototype.addSubSchemaObject = function(e, r) {
  if (!(!r || typeof r != "object"))
    for (var n in r)
      this.addSubSchema(e, r[n]);
};
W.prototype.setSchemas = function(e) {
  this.schemas = e;
};
W.prototype.getSchema = function(e) {
  return this.schemas[e];
};
W.prototype.validate = function(e, r, n, i) {
  if (typeof r != "boolean" && typeof r != "object" || r === null)
    throw new Qe("Expected `schema` to be an object or boolean");
  n || (n = {});
  var o = r.$id || r.id, a = ai.resolve(n.base || fi, o || "");
  if (!i) {
    i = new pi(r, n, [], a, Object.create(this.schemas)), i.schemas[a] || (i.schemas[a] = r);
    var s = li(a, r);
    for (var u in s.id) {
      var l = s.id[u];
      i.schemas[u] = l;
    }
  }
  if (n.required && e === void 0) {
    var p = new ui(e, r, n, i);
    return p.addError("is required, but is undefined"), p;
  }
  var p = this.validateSchema(e, r, n, i);
  if (p) {
    if (n.throwAll && p.errors.length)
      throw new vl(p);
  } else
    throw new Error("Result undefined");
  return p;
};
function ci(t) {
  var e = typeof t == "string" ? t : t.$ref;
  return typeof e == "string" ? e : !1;
}
W.prototype.validateSchema = function(e, r, n, i) {
  var o = new ui(e, r, n, i);
  if (typeof r == "boolean")
    r === !0 ? r = {} : r === !1 && (r = { type: [] });
  else if (!r)
    throw new Error("schema is undefined");
  if (r.extends)
    if (Array.isArray(r.extends)) {
      var a = { schema: r, ctx: i };
      r.extends.forEach(this.schemaTraverser.bind(this, a)), r = a.schema, a.schema = null, a.ctx = null, a = null;
    } else
      r = Re.deepMerge(r, this.superResolve(r.extends, i));
  var s = ci(r);
  if (s) {
    var u = this.resolve(r, s, i), l = new pi(u.subschema, n, i.path, u.switchSchema, i.schemas);
    return this.validateSchema(e, u.subschema, n, l);
  }
  var p = n && n.skipAttributes || [];
  for (var c in r)
    if (!si.ignoreProperties[c] && p.indexOf(c) < 0) {
      var f = null, d = this.attributes[c];
      if (d)
        f = d.call(this, e, r, n, i);
      else if (n.allowUnknownAttributes === !1)
        throw new Qe("Unsupported attribute: " + c, r);
      f && o.importErrors(f);
    }
  if (typeof n.rewrite == "function") {
    var g = n.rewrite.call(this, e, r, n, i);
    o.instance = g;
  }
  return o;
};
W.prototype.schemaTraverser = function(e, r) {
  e.schema = Re.deepMerge(e.schema, this.superResolve(r, e.ctx));
};
W.prototype.superResolve = function(e, r) {
  var n = ci(e);
  return n ? this.resolve(e, n, r).subschema : e;
};
W.prototype.resolve = function(e, r, n) {
  if (r = n.resolve(r), n.schemas[r])
    return { subschema: n.schemas[r], switchSchema: r };
  var i = ai.parse(r), o = i && i.hash, a = o && o.length && r.substr(0, r.length - o.length);
  if (!a || !n.schemas[a])
    throw new Qe("no such schema <" + r + ">", e);
  var s = Re.objectGetPath(n.schemas[a], o.substr(1));
  if (s === void 0)
    throw new Qe("no such schema " + o + " located in <" + a + ">", e);
  return { subschema: s, switchSchema: r };
};
W.prototype.testType = function(e, r, n, i, o) {
  if (o !== void 0) {
    if (o === null)
      throw new Qe('Unexpected null in "type" keyword');
    if (typeof this.types[o] == "function")
      return this.types[o].call(this, e);
    if (o && typeof o == "object") {
      var a = this.validateSchema(e, o, n, i);
      return a === void 0 || !(a && a.errors.length);
    }
    return !0;
  }
};
var he = W.prototype.types = {};
he.string = function(e) {
  return typeof e == "string";
};
he.number = function(e) {
  return typeof e == "number" && isFinite(e);
};
he.integer = function(e) {
  return typeof e == "number" && e % 1 === 0;
};
he.boolean = function(e) {
  return typeof e == "boolean";
};
he.array = function(e) {
  return Array.isArray(e);
};
he.null = function(e) {
  return e === null;
};
he.date = function(e) {
  return e instanceof Date;
};
he.any = function(e) {
  return !0;
};
he.object = function(e) {
  return e && typeof e == "object" && !Array.isArray(e) && !(e instanceof Date);
};
var bl = W, di;
di = bl;
L.ValidatorResult;
L.ValidatorResultError;
L.ValidationError;
L.SchemaError;
const { wpCLI: $l, ...un } = po, El = {
  ...un,
  "wp-cli": $l,
  importFile: un.importWxr
};
function _l(t, {
  progress: e = new Et(),
  semaphore: r = new Pi({ concurrency: 3 }),
  onStepCompleted: n = () => {
  }
} = {}) {
  var c, f, d, g, S, b, D;
  t = {
    ...t,
    steps: (t.steps || []).filter(xl).filter(Ol)
  };
  for (const h of t.steps)
    typeof h == "object" && h.step === "importFile" && (h.step = "importWxr", j.warn(
      'The "importFile" step is deprecated. Use "importWxr" instead.'
    ));
  if (t.constants && t.steps.unshift({
    step: "defineWpConfigConsts",
    consts: t.constants
  }), t.siteOptions && t.steps.unshift({
    step: "setSiteOptions",
    options: t.siteOptions
  }), t.plugins) {
    const h = t.plugins.map((y) => typeof y == "string" ? y.startsWith("https://") ? {
      resource: "url",
      url: y
    } : {
      resource: "wordpress.org/plugins",
      slug: y
    } : y).map((y) => ({
      step: "installPlugin",
      pluginZipFile: y
    }));
    t.steps.unshift(...h);
  }
  t.login && t.steps.push({
    step: "login",
    ...t.login === !0 ? { username: "admin", password: "password" } : t.login
  }), t.phpExtensionBundles || (t.phpExtensionBundles = []), t.phpExtensionBundles || (t.phpExtensionBundles = []), t.phpExtensionBundles.length === 0 && t.phpExtensionBundles.push("kitchen-sink");
  const i = (c = t.steps) == null ? void 0 : c.findIndex(
    (h) => typeof h == "object" && (h == null ? void 0 : h.step) === "wp-cli"
  );
  i !== void 0 && i > -1 && (t.phpExtensionBundles.includes("light") && (t.phpExtensionBundles = t.phpExtensionBundles.filter(
    (h) => h !== "light"
  ), j.warn(
    "The wpCli step used in your Blueprint requires the iconv and mbstring PHP extensions. However, you did not specify the kitchen-sink extension bundle. Playground will override your choice and load the kitchen-sink PHP extensions bundle to prevent the WP-CLI step from failing. "
  )), (f = t.steps) == null || f.splice(i, 0, {
    step: "writeFile",
    data: {
      resource: "url",
      /**
       * Use compression for downloading the wp-cli.phar file.
       * The official release, hosted at raw.githubusercontent.com, is ~7MB and the
       * transfer is uncompressed. playground.wordpress.net supports transfer compression
       * and only transmits ~1.4MB.
       *
       * @TODO: minify the wp-cli.phar file. It can be as small as 1MB when all the
       *        whitespaces and are removed, and even 500KB when libraries like the
       *        JavaScript parser or Composer are removed.
       */
      url: "https://playground.wordpress.net/wp-cli.phar"
    },
    path: "/tmp/wp-cli.phar"
  }));
  const o = (d = t.steps) == null ? void 0 : d.findIndex(
    (h) => typeof h == "object" && (h == null ? void 0 : h.step) === "importWxr"
  );
  o !== void 0 && o > -1 && (t.phpExtensionBundles.includes("light") && (t.phpExtensionBundles = t.phpExtensionBundles.filter(
    (h) => h !== "light"
  ), j.warn(
    "The importWxr step used in your Blueprint requires the iconv and mbstring PHP extensions. However, you did not specify the kitchen-sink extension bundle. Playground will override your choice and load the kitchen-sink PHP extensions bundle to prevent the WP-CLI step from failing. "
  )), (g = t.steps) == null || g.splice(o, 0, {
    step: "installPlugin",
    pluginZipFile: {
      resource: "url",
      url: "https://playground.wordpress.net/wordpress-importer.zip",
      caption: "Downloading the WordPress Importer plugin"
    }
  }));
  const { valid: a, errors: s } = Sl(t);
  if (!a) {
    const h = new Error(
      `Invalid blueprint: ${s[0].message} at ${JSON.stringify(
        s[0].instance
      )}`
    );
    throw h.errors = s, h;
  }
  const u = t.steps || [], l = u.reduce(
    (h, y) => {
      var E;
      return h + (((E = y.progress) == null ? void 0 : E.weight) || 1);
    },
    0
  ), p = u.map(
    (h) => Tl(h, {
      semaphore: r,
      rootProgressTracker: e,
      totalProgressWeight: l
    })
  );
  return {
    versions: {
      php: Al(
        (S = t.preferredVersions) == null ? void 0 : S.php,
        ur,
        vo
      ),
      wp: ((b = t.preferredVersions) == null ? void 0 : b.wp) || "latest"
    },
    phpExtensions: Fl(
      [],
      t.phpExtensionBundles || []
    ),
    features: {
      // Disable networking by default
      networking: ((D = t.features) == null ? void 0 : D.networking) ?? !1
    },
    run: async (h) => {
      try {
        for (const { resources: y } of p)
          for (const E of y)
            E.setPlayground(h), E.isAsync && E.resolve();
        for (const [y, { run: E, step: $ }] of Object.entries(p))
          try {
            const A = await E(h);
            n(A, $);
          } catch (A) {
            throw j.error(A), new Error(
              `Error when executing the blueprint step #${y} (${JSON.stringify(
                $
              )}) ${A instanceof Error ? `: ${A.message}` : A}`,
              { cause: A }
            );
          }
      } finally {
        try {
          await h.goTo(
            t.landingPage || "/"
          );
        } catch {
        }
        e.finish();
      }
    }
  };
}
const Pl = new di();
function Sl(t) {
  var o;
  const e = Pl.validate(
    t,
    Co
  ), r = e.errors.length === 0;
  if (r)
    return { valid: r };
  const n = /* @__PURE__ */ new Set();
  for (const a of e.errors)
    a.schema.toString().startsWith("#/properties/steps/items/anyOf") || n.add(a.instance);
  const i = (o = e.errors) == null ? void 0 : o.filter(
    (a) => !(a.schema.toString().startsWith("#/properties/steps/items/anyOf") && n.has(a.instance))
  );
  return {
    valid: r,
    errors: i
  };
}
function Al(t, e, r) {
  return t && e.includes(t) ? t : r;
}
function Fl(t, e) {
  const r = kn.filter(
    (i) => t.includes(i)
  ), n = e.flatMap(
    (i) => i in kr ? kr[i] : []
  );
  return Array.from(/* @__PURE__ */ new Set([...r, ...n]));
}
function xl(t) {
  return !!(typeof t == "object" && t);
}
function Ol(t) {
  return ["setPhpIniEntry", "request"].includes(t.step) ? (j.warn(
    `The "${t.step}" Blueprint is no longer supported and you can remove it from your Blueprint.`
  ), !1) : !0;
}
function Tl(t, {
  semaphore: e,
  rootProgressTracker: r,
  totalProgressWeight: n
}) {
  var p;
  const i = r.stage(
    (((p = t.progress) == null ? void 0 : p.weight) || 1) / n
  ), o = {};
  for (const c of Object.keys(t)) {
    let f = t[c];
    $o(f) && (f = Te.create(f, {
      semaphore: e
    })), o[c] = f;
  }
  const a = async (c) => {
    var f;
    try {
      return i.fillSlowly(), await El[t.step](
        c,
        await Rl(o),
        {
          tracker: i,
          initialCaption: (f = t.progress) == null ? void 0 : f.caption
        }
      );
    } finally {
      i.finish();
    }
  }, s = pn(o), u = pn(o).filter(
    (c) => c.isAsync
  ), l = 1 / (u.length + 1);
  for (const c of u)
    c.progress = i.stage(l);
  return { run: a, step: t, resources: s };
}
function pn(t) {
  const e = [];
  for (const r in t) {
    const n = t[r];
    n instanceof Te && e.push(n);
  }
  return e;
}
async function Rl(t) {
  const e = {};
  for (const r in t) {
    const n = t[r];
    n instanceof Te ? e[r] = await n.resolve() : e[r] = n;
  }
  return e;
}
async function kl(t, e) {
  await t.run(e);
}
function Yl() {
}
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const hi = Symbol("Comlink.proxy"), Cl = Symbol("Comlink.endpoint"), Il = Symbol("Comlink.releaseProxy"), jt = Symbol("Comlink.finalizer"), st = Symbol("Comlink.thrown"), yi = (t) => typeof t == "object" && t !== null || typeof t == "function", Ll = {
  canHandle: (t) => yi(t) && t[hi],
  serialize(t) {
    const { port1: e, port2: r } = new MessageChannel();
    return _r(t, e), [r, [r]];
  },
  deserialize(t) {
    return t.start(), Pr(t);
  }
}, Dl = {
  canHandle: (t) => yi(t) && st in t,
  serialize({ value: t }) {
    let e;
    return t instanceof Error ? e = {
      isError: !0,
      value: {
        message: t.message,
        name: t.name,
        stack: t.stack
      }
    } : e = { isError: !1, value: t }, [e, []];
  },
  deserialize(t) {
    throw t.isError ? Object.assign(new Error(t.value.message), t.value) : t.value;
  }
}, De = /* @__PURE__ */ new Map([
  ["proxy", Ll],
  ["throw", Dl]
]);
function zl(t, e) {
  for (const r of t)
    if (e === r || r === "*" || r instanceof RegExp && r.test(e))
      return !0;
  return !1;
}
function _r(t, e = globalThis, r = ["*"]) {
  e.addEventListener("message", function n(i) {
    if (!i || !i.data)
      return;
    if (!zl(r, i.origin)) {
      console.warn(`Invalid origin '${i.origin}' for comlink proxy`);
      return;
    }
    const { id: o, type: a, path: s } = Object.assign({ path: [] }, i.data), u = (i.data.argumentList || []).map(Ae);
    let l;
    try {
      const p = s.slice(0, -1).reduce((f, d) => f[d], t), c = s.reduce((f, d) => f[d], t);
      switch (a) {
        case "GET":
          l = c;
          break;
        case "SET":
          p[s.slice(-1)[0]] = Ae(i.data.value), l = !0;
          break;
        case "APPLY":
          l = c.apply(p, u);
          break;
        case "CONSTRUCT":
          {
            const f = new c(...u);
            l = vi(f);
          }
          break;
        case "ENDPOINT":
          {
            const { port1: f, port2: d } = new MessageChannel();
            _r(t, d), l = Wl(f, [f]);
          }
          break;
        case "RELEASE":
          l = void 0;
          break;
        default:
          return;
      }
    } catch (p) {
      l = { value: p, [st]: 0 };
    }
    Promise.resolve(l).catch((p) => ({ value: p, [st]: 0 })).then((p) => {
      const [c, f] = vt(p);
      e.postMessage(Object.assign(Object.assign({}, c), { id: o }), f), a === "RELEASE" && (e.removeEventListener("message", n), mi(e), jt in t && typeof t[jt] == "function" && t[jt]());
    }).catch((p) => {
      const [c, f] = vt({
        value: new TypeError("Unserializable return value"),
        [st]: 0
      });
      e.postMessage(Object.assign(Object.assign({}, c), { id: o }), f);
    });
  }), e.start && e.start();
}
function Ml(t) {
  return t.constructor.name === "MessagePort";
}
function mi(t) {
  Ml(t) && t.close();
}
function Pr(t, e) {
  return ar(t, [], e);
}
function nt(t) {
  if (t)
    throw new Error("Proxy has been released and is not useable");
}
function gi(t) {
  return Le(t, {
    type: "RELEASE"
  }).then(() => {
    mi(t);
  });
}
const gt = /* @__PURE__ */ new WeakMap(), wt = "FinalizationRegistry" in globalThis && new FinalizationRegistry((t) => {
  const e = (gt.get(t) || 0) - 1;
  gt.set(t, e), e === 0 && gi(t);
});
function Nl(t, e) {
  const r = (gt.get(e) || 0) + 1;
  gt.set(e, r), wt && wt.register(t, e, t);
}
function ql(t) {
  wt && wt.unregister(t);
}
function ar(t, e = [], r = function() {
}) {
  let n = !1;
  const i = new Proxy(r, {
    get(o, a) {
      if (nt(n), a === Il)
        return () => {
          ql(i), gi(t), n = !0;
        };
      if (a === "then") {
        if (e.length === 0)
          return { then: () => i };
        const s = Le(t, {
          type: "GET",
          path: e.map((u) => u.toString())
        }).then(Ae);
        return s.then.bind(s);
      }
      return ar(t, [...e, a]);
    },
    set(o, a, s) {
      nt(n);
      const [u, l] = vt(s);
      return Le(t, {
        type: "SET",
        path: [...e, a].map((p) => p.toString()),
        value: u
      }, l).then(Ae);
    },
    apply(o, a, s) {
      nt(n);
      const u = e[e.length - 1];
      if (u === Cl)
        return Le(t, {
          type: "ENDPOINT"
        }).then(Ae);
      if (u === "bind")
        return ar(t, e.slice(0, -1));
      const [l, p] = fn(s);
      return Le(t, {
        type: "APPLY",
        path: e.map((c) => c.toString()),
        argumentList: l
      }, p).then(Ae);
    },
    construct(o, a) {
      nt(n);
      const [s, u] = fn(a);
      return Le(t, {
        type: "CONSTRUCT",
        path: e.map((l) => l.toString()),
        argumentList: s
      }, u).then(Ae);
    }
  });
  return Nl(i, t), i;
}
function jl(t) {
  return Array.prototype.concat.apply([], t);
}
function fn(t) {
  const e = t.map(vt);
  return [e.map((r) => r[0]), jl(e.map((r) => r[1]))];
}
const wi = /* @__PURE__ */ new WeakMap();
function Wl(t, e) {
  return wi.set(t, e), t;
}
function vi(t) {
  return Object.assign(t, { [hi]: !0 });
}
function Bl(t, e = globalThis, r = "*") {
  return {
    postMessage: (n, i) => t.postMessage(n, r, i),
    addEventListener: e.addEventListener.bind(e),
    removeEventListener: e.removeEventListener.bind(e)
  };
}
function vt(t) {
  for (const [e, r] of De)
    if (r.canHandle(t)) {
      const [n, i] = r.serialize(t);
      return [
        {
          type: "HANDLER",
          name: e,
          value: n
        },
        i
      ];
    }
  return [
    {
      type: "RAW",
      value: t
    },
    wi.get(t) || []
  ];
}
function Ae(t) {
  switch (t.type) {
    case "HANDLER":
      return De.get(t.name).deserialize(t.value);
    case "RAW":
      return t.value;
  }
}
function Le(t, e, r) {
  return new Promise((n) => {
    const i = Ul();
    t.addEventListener("message", function o(a) {
      !a.data || !a.data.id || a.data.id !== i || (t.removeEventListener("message", o), n(a.data));
    }), t.start && t.start(), t.postMessage(Object.assign({ id: i }, e), r);
  });
}
function Ul() {
  return new Array(4).fill(0).map(() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16)).join("-");
}
function bi(t, e = void 0) {
  Hl();
  const r = t instanceof Worker ? t : Bl(t, e), n = Pr(r), i = $i(n);
  return new Proxy(i, {
    get: (o, a) => a === "isConnected" ? async () => {
      for (; ; )
        try {
          await Zl(n.isConnected(), 200);
          break;
        } catch {
        }
    } : n[a]
  });
}
async function Zl(t, e) {
  return new Promise((r, n) => {
    setTimeout(n, e), t.then(r);
  });
}
let cn = !1;
function Hl() {
  if (cn)
    return;
  cn = !0, De.set("EVENT", {
    canHandle: (r) => r instanceof CustomEvent,
    serialize: (r) => [
      {
        detail: r.detail
      },
      []
    ],
    deserialize: (r) => r
  }), De.set("FUNCTION", {
    canHandle: (r) => typeof r == "function",
    serialize(r) {
      const { port1: n, port2: i } = new MessageChannel();
      return _r(r, n), [i, [i]];
    },
    deserialize(r) {
      return r.start(), Pr(r);
    }
  }), De.set("PHPResponse", {
    canHandle: (r) => typeof r == "object" && r !== null && "headers" in r && "bytes" in r && "errors" in r && "exitCode" in r && "httpStatusCode" in r,
    serialize(r) {
      return [r.toRawData(), []];
    },
    deserialize(r) {
      return ft.fromRawData(r);
    }
  });
  const t = De.get("throw"), e = t == null ? void 0 : t.serialize;
  t.serialize = ({ value: r }) => {
    const n = e({ value: r });
    return r.response && (n[0].value.response = r.response), r.source && (n[0].value.source = r.source), n;
  };
}
function $i(t) {
  return new Proxy(t, {
    get(e, r) {
      switch (typeof e[r]) {
        case "function":
          return (...n) => e[r](...n);
        case "object":
          return e[r] === null ? e[r] : $i(e[r]);
        case "undefined":
        case "number":
        case "string":
          return e[r];
        default:
          return vi(e[r]);
      }
    }
  });
}
new Promise((t) => {
});
async function Vl({
  iframe: t,
  blueprint: e,
  remoteUrl: r,
  progressTracker: n = new Et(),
  disableProgressBar: i,
  onBlueprintStepCompleted: o,
  onClientConnected: a = () => {
  },
  sapiName: s,
  onBeforeBlueprint: u,
  siteSlug: l
}) {
  if (Ql(r), Gl(t), r = Wt(r, {
    progressbar: !i
  }), n.setCaption("Preparing WordPress"), !e) {
    const f = await dn(
      t,
      Wt(r, {
        "php-extension": "kitchen-sink",
        "site-slug": l
      }),
      n
    );
    return a(f), f;
  }
  const p = _l(e, {
    progress: n.stage(0.5),
    onStepCompleted: o
  }), c = await dn(
    t,
    Wt(r, {
      php: p.versions.php,
      wp: p.versions.wp,
      "sapi-name": s,
      "php-extension": p.phpExtensions,
      networking: p.features.networking ? "yes" : "no",
      "site-slug": l
    }),
    n
  );
  return Di(j, c), a(c), u && await u(), await kl(p, c), n.finish(), c;
}
function Gl(t) {
  var e, r;
  (e = t.sandbox) != null && e.length && !((r = t.sandbox) != null && r.contains("allow-storage-access-by-user-activation")) && t.sandbox.add("allow-storage-access-by-user-activation");
}
async function dn(t, e, r) {
  await new Promise((o) => {
    t.src = e, t.addEventListener("load", o, !1);
  });
  const n = bi(
    t.contentWindow,
    t.ownerDocument.defaultView
  );
  await n.isConnected(), r.pipe(n);
  const i = r.stage();
  return await n.onDownloadProgress(i.loadingListener), await n.isReady(), i.finish(), n;
}
const lt = "https://playground.wordpress.net";
function Ql(t) {
  const e = new URL(t, lt);
  if ((e.origin === lt || e.hostname === "localhost") && e.pathname !== "/remote.html")
    throw new Error(
      `Invalid remote URL: ${e}. Expected origin to be ${lt}/remote.html.`
    );
}
function Wt(t, e) {
  const r = new URL(t, lt), n = new URLSearchParams(r.search);
  for (const [i, o] of Object.entries(e))
    if (o != null && o !== !1)
      if (Array.isArray(o))
        for (const a of o)
          n.append(i, a.toString());
      else
        n.set(i, o.toString());
  return r.search = n.toString(), r.toString();
}
async function Xl(t, e) {
  if (j.warn(
    "`connectPlayground` is deprecated and will be removed. Use `startPlayground` instead."
  ), e != null && e.loadRemote)
    return Vl({
      iframe: t,
      remoteUrl: e.loadRemote
    });
  const r = bi(
    t.contentWindow,
    t.ownerDocument.defaultView
  );
  return await r.isConnected(), r;
}
export {
  vo as LatestSupportedPHPVersion,
  ur as SupportedPHPVersions,
  Kl as SupportedPHPVersionsList,
  sr as activatePlugin,
  $n as activateTheme,
  _l as compileBlueprint,
  Xl as connectPlayground,
  Vi as cp,
  An as defineSiteUrl,
  ut as defineWpConfigConsts,
  Zi as enableMultisite,
  Xi as exportWXR,
  Fn as importThemeStarterContent,
  Yi as importWordPressFiles,
  Ki as importWxr,
  eo as installPlugin,
  to as installTheme,
  Ht as login,
  Qi as mkdir,
  Gi as mv,
  I as phpVar,
  bt as phpVars,
  Zt as request,
  ro as resetData,
  En as rm,
  Ji as rmdir,
  kl as runBlueprintSteps,
  zi as runPHP,
  Mi as runPHPWithOptions,
  Ni as runSql,
  no as runWpInstallationWizard,
  Jl as setPhpIniEntries,
  Yl as setPluginProxyURL,
  uo as setSiteLanguage,
  _n as setSiteOptions,
  Vl as startPlaygroundWeb,
  lr as unzip,
  Bi as updateUserMeta,
  so as wpCLI,
  yn as wpContentFilesExcludedFromExport,
  Sn as writeFile,
  io as zipWpContent
};
