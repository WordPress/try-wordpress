const xs = function() {
  var e;
  return typeof process < "u" && ((e = process.release) == null ? void 0 : e.name) === "node" ? "NODE" : typeof window < "u" ? "WEB" : (
    // @ts-ignore
    typeof WorkerGlobalScope < "u" && // @ts-ignore
    self instanceof WorkerGlobalScope ? "WORKER" : "NODE"
  );
}();
if (xs === "NODE") {
  let e = function(r) {
    return new Promise(function(n, s) {
      r.onload = r.onerror = function(i) {
        r.onload = r.onerror = null, i.type === "load" ? n(r.result) : s(new Error("Failed to read the blob/file"));
      };
    });
  }, t = function() {
    const r = new Uint8Array([1, 2, 3, 4]), s = new File([r], "test").stream();
    try {
      return s.getReader({ mode: "byob" }), !0;
    } catch {
      return !1;
    }
  };
  if (typeof File > "u") {
    class r extends Blob {
      constructor(s, i, o) {
        super(s);
        let u;
        o != null && o.lastModified && (u = /* @__PURE__ */ new Date()), (!u || isNaN(u.getFullYear())) && (u = /* @__PURE__ */ new Date()), this.lastModifiedDate = u, this.lastModified = u.getMilliseconds(), this.name = i || "";
      }
    }
    global.File = r;
  }
  typeof Blob.prototype.arrayBuffer > "u" && (Blob.prototype.arrayBuffer = function() {
    const n = new FileReader();
    return n.readAsArrayBuffer(this), e(n);
  }), typeof Blob.prototype.text > "u" && (Blob.prototype.text = function() {
    const n = new FileReader();
    return n.readAsText(this), e(n);
  }), (typeof Blob.prototype.stream > "u" || !t()) && (Blob.prototype.stream = function() {
    let r = 0;
    const n = this;
    return new ReadableStream({
      type: "bytes",
      // 0.5 MB seems like a reasonable chunk size, let's adjust
      // this if needed.
      autoAllocateChunkSize: 512 * 1024,
      async pull(s) {
        const i = s.byobRequest.view, u = await n.slice(
          r,
          r + i.byteLength
        ).arrayBuffer(), f = new Uint8Array(u);
        new Uint8Array(i.buffer).set(f);
        const l = f.byteLength;
        s.byobRequest.respond(l), r += l, r >= n.size && s.close();
      }
    });
  });
}
if (xs === "NODE" && typeof CustomEvent > "u") {
  class e extends Event {
    constructor(r, n = {}) {
      super(r, n), this.detail = n.detail;
    }
    initCustomEvent() {
    }
  }
  globalThis.CustomEvent = e;
}
const Hs = [
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
], Bs = Symbol("SleepFinished");
function fo(e) {
  return new Promise((t) => {
    setTimeout(() => t(Bs), e);
  });
}
class po extends Error {
  constructor() {
    super("Acquiring lock timed out");
  }
}
class ho {
  constructor({ concurrency: t, timeout: r }) {
    this._running = 0, this.concurrency = t, this.timeout = r, this.queue = [];
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
        const t = new Promise((r) => {
          this.queue.push(r);
        });
        this.timeout !== void 0 ? await Promise.race([t, fo(this.timeout)]).then(
          (r) => {
            if (r === Bs)
              throw new po();
          }
        ) : await t;
      } else {
        this._running++;
        let t = !1;
        return () => {
          t || (t = !0, this._running--, this.queue.length > 0 && this.queue.shift()());
        };
      }
  }
  async run(t) {
    const r = await this.acquire();
    try {
      return await t();
    } finally {
      r();
    }
  }
}
function ue(...e) {
  function t(i) {
    return i.substring(i.length - 1) === "/";
  }
  let r = e.join("/");
  const n = r[0] === "/", s = t(r);
  return r = Ks(r), !r && !n && (r = "."), r && s && !t(r) && (r += "/"), r;
}
function Gs(e) {
  if (e === "/")
    return "/";
  e = Ks(e);
  const t = e.lastIndexOf("/");
  return t === -1 ? "" : t === 0 ? "/" : e.substr(0, t);
}
function Ks(e) {
  const t = e[0] === "/";
  return e = mo(
    e.split("/").filter((r) => !!r),
    !t
  ).join("/"), (t ? "/" : "") + e.replace(/\/$/, "");
}
function mo(e, t) {
  let r = 0;
  for (let n = e.length - 1; n >= 0; n--) {
    const s = e[n];
    s === "." ? e.splice(n, 1) : s === ".." ? (e.splice(n, 1), r++) : r && (e.splice(n, 1), r--);
  }
  if (t)
    for (; r; r--)
      e.unshift("..");
  return e;
}
function Js(e = 36, t = "!@#$%^&*()_+=-[]/.,<>?") {
  const r = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" + t;
  let n = "";
  for (let s = e; s > 0; --s)
    n += r[Math.floor(Math.random() * r.length)];
  return n;
}
function yo() {
  return Js(36, "-_");
}
function de(e) {
  return `json_decode(base64_decode('${go(
    JSON.stringify(e)
  )}'), true)`;
}
function Nr(e) {
  const t = {};
  for (const r in e)
    t[r] = de(e[r]);
  return t;
}
function go(e) {
  return $o(new TextEncoder().encode(e));
}
function $o(e) {
  const t = String.fromCodePoint(...e);
  return btoa(t);
}
const _o = "playground-log", fs = (e, ...t) => {
  he.dispatchEvent(
    new CustomEvent(_o, {
      detail: {
        log: e,
        args: t
      }
    })
  );
}, wo = (e, ...t) => {
  switch (typeof e.message == "string" ? e.message = Yr(e.message) : e.message.message && typeof e.message.message == "string" && (e.message.message = Yr(e.message.message)), e.severity) {
    case "Debug":
      console.debug(e.message, ...t);
      break;
    case "Info":
      console.info(e.message, ...t);
      break;
    case "Warn":
      console.warn(e.message, ...t);
      break;
    case "Error":
      console.error(e.message, ...t);
      break;
    case "Fatal":
      console.error(e.message, ...t);
      break;
    default:
      console.log(e.message, ...t);
  }
}, vo = (e) => e instanceof Error ? [e.message, e.stack].join(`
`) : JSON.stringify(e, null, 2), Qs = [], ps = (e) => {
  Qs.push(e);
}, Qr = (e) => {
  if (e.raw === !0)
    ps(e.message);
  else {
    const t = Po(
      typeof e.message == "object" ? vo(e.message) : e.message,
      e.severity ?? "Info",
      e.prefix ?? "JavaScript"
    );
    ps(t);
  }
};
class bo extends EventTarget {
  // constructor
  constructor(t = []) {
    super(), this.handlers = t, this.fatalErrorEvent = "playground-fatal-error";
  }
  /**
   * Get all logs.
   * @returns string[]
   */
  getLogs() {
    return this.handlers.includes(Qr) ? [...Qs] : (this.error(`Logs aren't stored because the logToMemory handler isn't registered.
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
  logMessage(t, ...r) {
    for (const n of this.handlers)
      n(t, ...r);
  }
  /**
   * Log message
   *
   * @param message any
   * @param args any
   */
  log(t, ...r) {
    this.logMessage(
      {
        message: t,
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
  debug(t, ...r) {
    this.logMessage(
      {
        message: t,
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
  info(t, ...r) {
    this.logMessage(
      {
        message: t,
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
  warn(t, ...r) {
    this.logMessage(
      {
        message: t,
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
  error(t, ...r) {
    this.logMessage(
      {
        message: t,
        severity: "Error",
        prefix: "JavaScript",
        raw: !1
      },
      ...r
    );
  }
}
const Eo = () => {
  try {
    if (process.env.NODE_ENV === "test")
      return [Qr, fs];
  } catch {
  }
  return [Qr, wo, fs];
}, he = new bo(Eo()), Yr = (e) => e.replace(/\t/g, ""), Po = (e, t, r) => {
  const n = /* @__PURE__ */ new Date(), s = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone: "UTC"
  }).format(n).replace(/ /g, "-"), i = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: !1,
    timeZone: "UTC",
    timeZoneName: "short"
  }).format(n), o = s + " " + i;
  return e = Yr(e), `[${o}] ${r} ${t}: ${e}`;
};
let qr = 0;
const hs = "/wordpress/wp-content/debug.log", So = async (e) => await e.fileExists(hs) ? await e.readFileAsText(hs) : "", To = (e, t) => {
  t.addEventListener("request.end", async () => {
    const r = await So(t);
    if (r.length > qr) {
      const n = r.substring(qr);
      e.logMessage({
        message: n,
        raw: !0
      }), qr = r.length;
    }
  }), t.addEventListener("request.error", (r) => {
    r = r, r.error && (e.logMessage({
      message: `${r.error.message} ${r.error.stack}`,
      severity: "Fatal",
      prefix: r.source === "request" ? "PHP" : "WASM Crash"
    }), e.dispatchEvent(
      new CustomEvent(e.fatalErrorEvent, {
        detail: {
          logs: e.getLogs(),
          source: r.source
        }
      })
    ));
  });
}, un = async (e, { pluginPath: t, pluginName: r }, n) => {
  n == null || n.tracker.setCaption(`Activating ${r || t}`);
  const s = await e.documentRoot, i = await e.run({
    code: `<?php
			define( 'WP_ADMIN', true );
			require_once( ${de(s)}. "/wp-load.php" );
			require_once( ${de(s)}. "/wp-admin/includes/plugin.php" );

			// Set current user to admin
			wp_set_current_user( get_users(array('role' => 'Administrator') )[0]->ID );

			$plugin_path = ${de(t)};
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
  if (i.text !== "Plugin activated successfully")
    throw he.debug(i), new Error(
      `Plugin ${t} could not be activated – WordPress exited with no error. Sometimes, when $_SERVER or site options are not configured correctly, WordPress exits early with a 301 redirect. Inspect the "debug" logs in the console for more details`
    );
}, Ys = async (e, { themeFolderName: t }, r) => {
  r == null || r.tracker.setCaption(`Activating ${t}`);
  const n = await e.documentRoot, s = `${n}/wp-content/themes/${t}`;
  if (!await e.fileExists(s))
    throw new Error(`
			Couldn't activate theme ${t}.
			Theme not found at the provided theme path: ${s}.
			Check the theme path to ensure it's correct.
			If the theme is not installed, you can install it using the installTheme step.
			More info can be found in the Blueprint documentation: https://wordpress.github.io/wordpress-playground/blueprints-api/steps/#ActivateThemeStep
		`);
  const i = await e.run({
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
      themeFolderName: t
    }
  });
  if (i.text !== "Theme activated successfully")
    throw he.debug(i), new Error(
      `Theme ${t} could not be activated – WordPress exited with no error. Sometimes, when $_SERVER or site options are not configured correctly, WordPress exits early with a 301 redirect. Inspect the "debug" logs in the console for more details`
    );
}, Ro = async (e, { code: t }) => await e.run({ code: t }), ko = async (e, { options: t }) => await e.run(t), Zs = async (e, { path: t }) => {
  await e.unlink(t);
}, Oo = async (e, { sql: t }, r) => {
  r == null || r.tracker.setCaption("Executing SQL Queries");
  const n = `/tmp/${yo()}.sql`;
  await e.writeFile(
    n,
    new Uint8Array(await t.arrayBuffer())
  );
  const s = await e.documentRoot, i = Nr({ docroot: s, sqlFilename: n }), o = await e.run({
    code: `<?php
		require_once ${i.docroot} . '/wp-load.php';

		$handle = fopen(${i.sqlFilename}, 'r');
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
  return await Zs(e, { path: n }), o;
}, Zr = async (e, { request: t }) => {
  he.warn(
    'Deprecated: The Blueprint step "request" is deprecated and will be removed in a future release.'
  );
  const r = await e.request(t);
  if (r.httpStatusCode > 399 || r.httpStatusCode < 200)
    throw he.warn("WordPress response was", { response: r }), new Error(
      `Request failed with status ${r.httpStatusCode}`
    );
  return r;
}, Co = `<?php

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
`, wr = async (e, { consts: t, method: r = "define-before-run" }) => {
  switch (r) {
    case "define-before-run":
      await No(e, t);
      break;
    case "rewrite-wp-config": {
      const n = await e.documentRoot, s = ue(n, "/wp-config.php"), i = await e.readFileAsText(s), o = await Io(
        e,
        i,
        t
      );
      await e.writeFile(s, o);
      break;
    }
    default:
      throw new Error(`Invalid method: ${r}`);
  }
};
async function No(e, t) {
  for (const r in t)
    await e.defineConstant(r, t[r]);
}
async function Io(e, t, r) {
  await e.writeFile("/tmp/code.php", t);
  const n = Nr({
    consts: r
  });
  return await e.run({
    code: `${Co}
	$wp_config_path = '/tmp/code.php';
	$wp_config = file_get_contents($wp_config_path);
	$new_wp_config = rewrite_wp_config_to_define_constants($wp_config, ${n.consts});
	file_put_contents($wp_config_path, $new_wp_config);
	`
  }), await e.readFileAsText("/tmp/code.php");
}
const Xr = async (e, { username: t = "admin", password: r = "password" } = {}, n) => {
  var i, o, u;
  n == null || n.tracker.setCaption((n == null ? void 0 : n.initialCaption) || "Logging in"), await e.request({
    url: "/wp-login.php"
  });
  const s = await e.request({
    url: "/wp-login.php",
    method: "POST",
    body: {
      log: t,
      pwd: r,
      rememberme: "forever"
    }
  });
  if (!((u = (o = (i = s.headers) == null ? void 0 : i.location) == null ? void 0 : o[0]) != null && u.includes("/wp-admin/")))
    throw he.warn("WordPress response was", {
      response: s,
      text: s.text
    }), new Error(
      `Failed to log in as ${t} with password ${r}`
    );
}, Xs = async (e, { options: t }) => {
  const r = await e.documentRoot;
  await e.run({
    code: `<?php
		include ${de(r)} . '/wp-load.php';
		$site_options = ${de(t)};
		foreach($site_options as $name => $value) {
			update_option($name, $value);
		}
		echo "Success";
		`
  });
}, jo = async (e, { meta: t, userId: r }) => {
  const n = await e.documentRoot;
  await e.run({
    code: `<?php
		include ${de(n)} . '/wp-load.php';
		$meta = ${de(t)};
		foreach($meta as $name => $value) {
			update_user_meta(${de(r)}, $name, $value);
		}
		`
  });
};
function ei(e) {
  return e.pathname.startsWith("/scope:");
}
function Ao(e) {
  return ei(e) ? e.pathname.split("/")[1].split(":")[1] : null;
}
const Do = async (e) => {
  var _;
  await wr(e, {
    consts: {
      WP_ALLOW_MULTISITE: 1
    }
  });
  const t = new URL(await e.absoluteUrl);
  if (t.port !== "") {
    let b = `The current host is ${t.host}, but WordPress multisites do not support custom ports.`;
    throw t.hostname === "localhost" && (b += " For development, you can set up a playground.test domain using the instructions at https://wordpress.github.io/wordpress-playground/contributing/code."), new Error(b);
  }
  const r = t.pathname.replace(/\/$/, "") + "/", n = `${t.protocol}//${t.hostname}${r}`;
  await Xs(e, {
    options: {
      siteurl: n,
      home: n
    }
  }), await Xr(e, {});
  const s = await e.documentRoot, o = (await e.run({
    code: `<?php
define( 'WP_ADMIN', true );
require_once(${de(s)} . "/wp-load.php");

// Set current user to admin
( get_users(array('role' => 'Administrator') )[0] );

require_once(${de(s)} . "/wp-admin/includes/plugin.php");
$plugins_root = ${de(s)} . "/wp-content/plugins";
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
  })).json, f = (_ = (await Zr(e, {
    request: {
      url: "/wp-admin/network.php"
    }
  })).text.match(
    /name="_wpnonce"\s+value="([^"]+)"/
  )) == null ? void 0 : _[1], l = await Zr(e, {
    request: {
      url: "/wp-admin/network.php",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: Mo({
        _wpnonce: f,
        _wp_http_referer: r + "wp-admin/network.php",
        sitename: "My WordPress Website Sites",
        email: "admin@localhost.com",
        submit: "Install"
      })
    }
  });
  if (l.httpStatusCode !== 200)
    throw he.warn("WordPress response was", {
      response: l,
      text: l.text,
      headers: l.headers
    }), new Error(
      `Failed to enable multisite. Response code was ${l.httpStatusCode}`
    );
  await wr(e, {
    consts: {
      MULTISITE: !0,
      SUBDOMAIN_INSTALL: !1,
      SITE_ID_CURRENT_SITE: 1,
      BLOG_ID_CURRENT_SITE: 1,
      DOMAIN_CURRENT_SITE: t.hostname,
      PATH_CURRENT_SITE: r
    }
  });
  const d = new URL(await e.absoluteUrl), p = ei(d) ? "scope:" + Ao(d) : null;
  await e.writeFile(
    "/internal/shared/preload/sunrise.php",
    `<?php
	$_SERVER['HTTP_HOST'] = ${de(d.hostname)};
	$folder = ${de(p)};
	if ($folder && strpos($_SERVER['REQUEST_URI'],"/$folder") === false) {
		$_SERVER['REQUEST_URI'] = "/$folder/" . ltrim($_SERVER['REQUEST_URI'], '/');
	}
`
  ), await e.writeFile(
    "/internal/shared/mu-plugins/sunrise.php",
    `<?php
		if ( !defined( 'BLOG_ID_CURRENT_SITE' ) ) {
			define( 'BLOG_ID_CURRENT_SITE', 1 );
		}
`
  ), await Xr(e, {});
  for (const b of o)
    await un(e, {
      pluginPath: b
    });
};
function Mo(e) {
  return Object.keys(e).map(
    (t) => encodeURIComponent(t) + "=" + encodeURIComponent(e[t])
  ).join("&");
}
const Lo = async (e, { fromPath: t, toPath: r }) => {
  await e.writeFile(
    r,
    await e.readFileAsBuffer(t)
  );
}, Fo = async (e, { fromPath: t, toPath: r }) => {
  await e.mv(t, r);
}, qo = async (e, { path: t }) => {
  await e.mkdir(t);
}, Uo = async (e, { path: t }) => {
  await e.rmdir(t);
}, ti = async (e, { path: t, data: r }) => {
  r instanceof File && (r = new Uint8Array(await r.arrayBuffer())), t.startsWith("/wordpress/wp-content/mu-plugins") && !await e.fileExists("/wordpress/wp-content/mu-plugins") && await e.mkdir("/wordpress/wp-content/mu-plugins"), await e.writeFile(t, r);
}, ri = async (e, { siteUrl: t }) => {
  await wr(e, {
    consts: {
      WP_HOME: t,
      WP_SITEURL: t
    }
  });
}, zo = async (e, { file: t }, r) => {
  var s;
  (s = r == null ? void 0 : r.tracker) == null || s.setCaption("Importing content"), await ti(e, {
    path: "/tmp/import.wxr",
    data: t
  });
  const n = await e.documentRoot;
  await e.run({
    code: `<?php
		require ${de(n)} . '/wp-load.php';
		require ${de(n)} . '/wp-admin/includes/admin.php';
  
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
}, ni = async (e, { themeSlug: t = "" }, r) => {
  var s;
  (s = r == null ? void 0 : r.tracker) == null || s.setCaption("Importing theme starter content");
  const n = await e.documentRoot;
  await e.run({
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
			$_REQUEST['customize_theme'] = ${de(t)} ?: get_stylesheet();

			/*
			 * Claim this is a ajax request saving settings, to avoid the preview filters being applied.
			 */
			$_REQUEST['action'] = 'customize_save';
			add_filter( 'wp_doing_ajax', '__return_true' );

			$_GET = $_REQUEST;
		}
		playground_add_filter( 'plugins_loaded', 'importThemeStarterContent_plugins_loaded', 0 );

		require ${de(n)} . '/wp-load.php';

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
}, Ur = "/tmp/file.zip", si = async (e, t, r, n = !0) => {
  if (t instanceof File) {
    const i = t;
    t = Ur, await e.writeFile(
      t,
      new Uint8Array(await i.arrayBuffer())
    );
  }
  const s = Nr({
    zipPath: t,
    extractToPath: r,
    overwriteFiles: n
  });
  await e.run({
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
        unzip(${s.zipPath}, ${s.extractToPath}, ${s.overwriteFiles});
        `
  }), await e.fileExists(Ur) && await e.unlink(Ur);
}, dn = async (e, { zipFile: t, zipPath: r, extractToPath: n }) => {
  if (r)
    he.warn(
      'The "zipPath" option of the unzip() Blueprint step is deprecated and will be removed. Use "zipFile" instead.'
    );
  else if (!t)
    throw new Error("Either zipPath or zipFile must be provided");
  await si(e, t || r, n);
}, Vo = async (e, { wordPressFilesZip: t, pathInZip: r = "" }) => {
  const n = await e.documentRoot;
  let s = ue("/tmp", "import");
  await e.mkdir(s), await dn(e, {
    zipFile: t,
    extractToPath: s
  }), s = ue(s, r);
  const i = ue(s, "wp-content"), o = ue(n, "wp-content");
  for (const d of Hs) {
    const p = ue(
      i,
      d
    );
    await ms(e, p);
    const _ = ue(o, d);
    await e.fileExists(_) && (await e.mkdir(Gs(p)), await e.mv(_, p));
  }
  const u = ue(
    s,
    "wp-content",
    "database"
  );
  await e.fileExists(u) || await e.mv(
    ue(n, "wp-content", "database"),
    u
  );
  const f = await e.listFiles(s);
  for (const d of f)
    await ms(e, ue(n, d)), await e.mv(
      ue(s, d),
      ue(n, d)
    );
  await e.rmdir(s), await ri(e, {
    siteUrl: await e.absoluteUrl
  });
  const l = de(
    ue(n, "wp-admin", "upgrade.php")
  );
  await e.run({
    code: `<?php
            $_GET['step'] = 'upgrade_db';
            require ${l};
            `
  });
};
async function ms(e, t) {
  await e.fileExists(t) && (await e.isDir(t) ? await e.rmdir(t) : await e.unlink(t));
}
async function Wo(e) {
  const t = await e.request({
    url: "/wp-admin/export.php?download=true&content=all"
  });
  return new File([t.bytes], "export.xml");
}
async function ii(e, {
  targetPath: t,
  zipFile: r,
  ifAlreadyInstalled: n = "overwrite"
}) {
  const i = r.name.replace(/\.zip$/, ""), o = ue(await e.documentRoot, "wp-content"), u = ue(o, Js()), f = ue(u, "assets", i);
  await e.fileExists(f) && await e.rmdir(u, {
    recursive: !0
  }), await e.mkdir(u);
  try {
    await dn(e, {
      zipFile: r,
      extractToPath: f
    });
    let l = await e.listFiles(f, {
      prependPath: !0
    });
    l = l.filter((P) => !P.endsWith("/__MACOSX"));
    const d = l.length === 1 && await e.isDir(l[0]);
    let p, _ = "";
    d ? (_ = l[0], p = l[0].split("/").pop()) : (_ = f, p = i);
    const b = `${t}/${p}`;
    if (await e.fileExists(b)) {
      if (!await e.isDir(b))
        throw new Error(
          `Cannot install asset ${p} to ${b} because a file with the same name already exists. Note it's a file, not a directory! Is this by mistake?`
        );
      if (n === "overwrite")
        await e.rmdir(b, {
          recursive: !0
        });
      else {
        if (n === "skip")
          return {
            assetFolderPath: b,
            assetFolderName: p
          };
        throw new Error(
          `Cannot install asset ${p} to ${t} because it already exists and the ifAlreadyInstalled option was set to ${n}`
        );
      }
    }
    return await e.mv(_, b), {
      assetFolderPath: b,
      assetFolderName: p
    };
  } finally {
    await e.rmdir(u, {
      recursive: !0
    });
  }
}
function Ir(e) {
  const t = e.split(".").shift().replace(/-/g, " ");
  return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
}
const xo = async (e, { pluginZipFile: t, ifAlreadyInstalled: r, options: n = {} }, s) => {
  const i = t.name.split("/").pop() || "plugin.zip", o = Ir(i);
  s == null || s.tracker.setCaption(`Installing the ${o} plugin`);
  const { assetFolderPath: u } = await ii(e, {
    ifAlreadyInstalled: r,
    zipFile: t,
    targetPath: `${await e.documentRoot}/wp-content/plugins`
  });
  ("activate" in n ? n.activate : !0) && await un(
    e,
    {
      pluginPath: u,
      pluginName: o
    },
    s
  );
}, Ho = async (e, { themeZipFile: t, ifAlreadyInstalled: r, options: n = {} }, s) => {
  const i = Ir(t.name);
  s == null || s.tracker.setCaption(`Installing the ${i} theme`);
  const { assetFolderName: o } = await ii(e, {
    ifAlreadyInstalled: r,
    zipFile: t,
    targetPath: `${await e.documentRoot}/wp-content/themes`
  });
  ("activate" in n ? n.activate : !0) && await Ys(
    e,
    {
      themeFolderName: o
    },
    s
  ), ("importStarterContent" in n ? n.importStarterContent : !1) && await ni(
    e,
    {
      themeSlug: o
    },
    s
  );
}, Bo = async (e, t, r) => {
  var s;
  (s = r == null ? void 0 : r.tracker) == null || s.setCaption("Resetting WordPress data");
  const n = await e.documentRoot;
  await e.run({
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
}, Go = async (e, { options: t }) => {
  await e.request({
    url: "/wp-admin/install.php?step=2",
    method: "POST",
    body: {
      language: "en",
      prefix: "wp_",
      weblog_title: "My WordPress Website",
      user_name: t.adminPassword || "admin",
      admin_password: t.adminPassword || "password",
      // The installation wizard demands typing the same password twice
      admin_password2: t.adminPassword || "password",
      Submit: "Install WordPress",
      pw_weak: "1",
      admin_email: "admin@localhost.com"
    }
  });
}, Ko = async (e, { selfContained: t = !1 } = {}) => {
  const r = "/tmp/wordpress-playground.zip", n = await e.documentRoot, s = ue(n, "wp-content");
  let i = Hs;
  t && (i = i.filter((f) => !f.startsWith("themes/twenty")).filter(
    (f) => f !== "mu-plugins/sqlite-database-integration"
  ));
  const o = Nr({
    zipPath: r,
    wpContentPath: s,
    documentRoot: n,
    exceptPaths: i.map(
      (f) => ue(n, "wp-content", f)
    ),
    additionalPaths: t ? {
      [ue(n, "wp-config.php")]: "wp-config.php"
    } : {}
  });
  await Qo(
    e,
    `zipDir(${o.wpContentPath}, ${o.zipPath}, array(
			'exclude_paths' => ${o.exceptPaths},
			'zip_root'      => ${o.documentRoot},
			'additional_paths' => ${o.additionalPaths}
		));`
  );
  const u = await e.readFileAsBuffer(r);
  return e.unlink(r), u;
}, Jo = `<?php

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
async function Qo(e, t) {
  return await e.run({
    code: Jo + t
  });
}
const Yo = async (e, { command: t, wpCliPath: r = "/tmp/wp-cli.phar" }) => {
  if (!await e.fileExists(r))
    throw new Error(`wp-cli.phar not found at ${r}`);
  let n;
  if (typeof t == "string" ? (t = t.trim(), n = Zo(t)) : n = t, n.shift() !== "wp")
    throw new Error('The first argument must be "wp".');
  await e.writeFile("/tmp/stdout", ""), await e.writeFile("/tmp/stderr", ""), await e.writeFile(
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
		], ${de(n)});

		// Provide stdin, stdout, stderr streams outside of
		// the CLI SAPI.
		define('STDIN', fopen('php://stdin', 'rb'));
		define('STDOUT', fopen('php://stdout', 'wb'));
		define('STDERR', fopen('php://stderr', 'wb'));

		require( ${de(r)} );
		`
  );
  const i = await e.run({
    scriptPath: "/wordpress/run-cli.php"
  });
  if (i.errors)
    throw new Error(i.errors);
  return i;
};
function Zo(e) {
  let n = 0, s = "";
  const i = [];
  let o = "";
  for (let u = 0; u < e.length; u++) {
    const f = e[u];
    n === 0 ? f === '"' || f === "'" ? (n = 1, s = f) : f.match(/\s/) ? (o && i.push(o), o = "") : o += f : n === 1 && (f === "\\" ? (u++, o += e[u]) : f === s ? (n = 0, s = "") : o += f);
  }
  return o && i.push(o), i;
}
const Xo = async (e, { language: t }, r) => {
  r == null || r.tracker.setCaption((r == null ? void 0 : r.initialCaption) || "Translating"), await e.defineConstant("WPLANG", t);
  const n = await e.documentRoot, i = [
    {
      url: `https://downloads.wordpress.org/translation/core/${(await e.run({
        code: `<?php
			require '${n}/wp-includes/version.php';
			echo $wp_version;
		`
      })).text}/${t}.zip`,
      type: "core"
    }
  ], u = (await e.run({
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
  for (const { slug: d, version: p } of u)
    i.push({
      url: `https://downloads.wordpress.org/translation/plugin/${d}/${p}/${t}.zip`,
      type: "plugin"
    });
  const l = (await e.run({
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
  for (const { slug: d, version: p } of l)
    i.push({
      url: `https://downloads.wordpress.org/translation/theme/${d}/${p}/${t}.zip`,
      type: "theme"
    });
  await e.isDir(`${n}/wp-content/languages/plugins`) || await e.mkdir(`${n}/wp-content/languages/plugins`), await e.isDir(`${n}/wp-content/languages/themes`) || await e.mkdir(`${n}/wp-content/languages/themes`);
  for (const { url: d, type: p } of i)
    try {
      const _ = await fetch(d);
      if (!_.ok)
        throw new Error(
          `Failed to download translations for ${p}: ${_.statusText}`
        );
      let b = `${n}/wp-content/languages`;
      p === "plugin" ? b += "/plugins" : p === "theme" && (b += "/themes"), await si(
        e,
        new File([await _.blob()], `${t}-${p}.zip`),
        b
      );
    } catch (_) {
      if (p === "core")
        throw new Error(
          `Failed to download translations for WordPress. Please check if the language code ${t} is correct. You can find all available languages and translations on https://translate.wordpress.org/.`
        );
      he.warn(`Error downloading translations for ${p}: ${_}`);
    }
}, ea = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  activatePlugin: un,
  activateTheme: Ys,
  cp: Lo,
  defineSiteUrl: ri,
  defineWpConfigConsts: wr,
  enableMultisite: Do,
  exportWXR: Wo,
  importThemeStarterContent: ni,
  importWordPressFiles: Vo,
  importWxr: zo,
  installPlugin: xo,
  installTheme: Ho,
  login: Xr,
  mkdir: qo,
  mv: Fo,
  request: Zr,
  resetData: Bo,
  rm: Zs,
  rmdir: Uo,
  runPHP: Ro,
  runPHPWithOptions: ko,
  runSql: Oo,
  runWpInstallationWizard: Go,
  setSiteLanguage: Xo,
  setSiteOptions: Xs,
  unzip: dn,
  updateUserMeta: jo,
  wpCLI: Yo,
  writeFile: ti,
  zipWpContent: Ko
}, Symbol.toStringTag, { value: "Module" })), ta = 5 * 1024 * 1024;
function ra(e, t) {
  const r = e.headers.get("content-length") || "", n = parseInt(r, 10) || ta;
  function s(i, o) {
    t(
      new CustomEvent("progress", {
        detail: {
          loaded: i,
          total: o
        }
      })
    );
  }
  return new Response(
    new ReadableStream({
      async start(i) {
        if (!e.body) {
          i.close();
          return;
        }
        const o = e.body.getReader();
        let u = 0;
        for (; ; )
          try {
            const { done: f, value: l } = await o.read();
            if (l && (u += l.byteLength), f) {
              s(u, u), i.close();
              break;
            } else
              s(u, n), i.enqueue(l);
          } catch (f) {
            he.error({ e: f }), i.error(f);
            break;
          }
      }
    }),
    {
      status: e.status,
      statusText: e.statusText,
      headers: e.headers
    }
  );
}
const zr = 1e-5;
class jr extends EventTarget {
  constructor({
    weight: t = 1,
    caption: r = "",
    fillTime: n = 4
  } = {}) {
    super(), this._selfWeight = 1, this._selfDone = !1, this._selfProgress = 0, this._selfCaption = "", this._isFilling = !1, this._subTrackers = [], this._weight = t, this._selfCaption = r, this._fillTime = n;
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
  stage(t, r = "") {
    if (t || (t = this._selfWeight), this._selfWeight - t < -zr)
      throw new Error(
        `Cannot add a stage with weight ${t} as the total weight of registered stages would exceed 1.`
      );
    this._selfWeight -= t;
    const n = new jr({
      caption: r,
      weight: t,
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
  fillSlowly({ stopBeforeFinishing: t = !0 } = {}) {
    if (this._isFilling)
      return;
    this._isFilling = !0;
    const r = 100, n = this._fillTime / r;
    this._fillInterval = setInterval(() => {
      this.set(this._selfProgress + 1), t && this._selfProgress >= 99 && clearInterval(this._fillInterval);
    }, n);
  }
  set(t) {
    this._selfProgress = Math.min(t, 100), this.notifyProgress(), this._selfProgress + zr >= 100 && this.finish();
  }
  finish() {
    this._fillInterval && clearInterval(this._fillInterval), this._selfDone = !0, this._selfProgress = 100, this._isFilling = !1, this._fillInterval = void 0, this.notifyProgress(), this.notifyDone();
  }
  get caption() {
    for (let t = this._subTrackers.length - 1; t >= 0; t--)
      if (!this._subTrackers[t].done) {
        const r = this._subTrackers[t].caption;
        if (r)
          return r;
      }
    return this._selfCaption;
  }
  setCaption(t) {
    this._selfCaption = t, this.notifyProgress();
  }
  get done() {
    return this.progress + zr >= 100;
  }
  get progress() {
    if (this._selfDone)
      return 100;
    const t = this._subTrackers.reduce(
      (r, n) => r + n.progress * n.weight,
      this._selfProgress * this._selfWeight
    );
    return Math.round(t * 1e4) / 1e4;
  }
  get weight() {
    return this._weight;
  }
  get observer() {
    return this._progressObserver || (this._progressObserver = (t) => {
      this.set(t);
    }), this._progressObserver;
  }
  get loadingListener() {
    return this._loadingListener || (this._loadingListener = (t) => {
      this.set(t.detail.loaded / t.detail.total * 100);
    }), this._loadingListener;
  }
  pipe(t) {
    t.setProgress({
      progress: this.progress,
      caption: this.caption
    }), this.addEventListener("progress", (r) => {
      t.setProgress({
        progress: r.detail.progress,
        caption: r.detail.caption
      });
    }), this.addEventListener("done", () => {
      t.setLoaded();
    });
  }
  addEventListener(t, r) {
    super.addEventListener(t, r);
  }
  removeEventListener(t, r) {
    super.removeEventListener(t, r);
  }
  notifyProgress() {
    const t = this;
    this.dispatchEvent(
      new CustomEvent("progress", {
        detail: {
          get progress() {
            return t.progress;
          },
          get caption() {
            return t.caption;
          }
        }
      })
    );
  }
  notifyDone() {
    this.dispatchEvent(new CustomEvent("done"));
  }
}
const vr = {
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
function na(e) {
  const t = typeof e == "object" ? e == null ? void 0 : e.errno : null;
  if (t in vr)
    return vr[t];
}
function Ue(e = "") {
  return function(r, n, s) {
    const i = s.value;
    s.value = function(...o) {
      try {
        return i.apply(this, o);
      } catch (u) {
        const f = typeof u == "object" ? u == null ? void 0 : u.errno : null;
        if (f in vr) {
          const l = vr[f], d = typeof o[1] == "string" ? o[1] : null, p = d !== null ? e.replaceAll("{path}", d) : e;
          throw new Error(`${p}: ${l}`, {
            cause: u
          });
        }
        throw u;
      }
    };
  };
}
var sa = Object.defineProperty, ia = Object.getOwnPropertyDescriptor, ze = (e, t, r, n) => {
  for (var s = n > 1 ? void 0 : n ? ia(t, r) : t, i = e.length - 1, o; i >= 0; i--)
    (o = e[i]) && (s = (n ? o(t, r, s) : o(s)) || s);
  return n && s && sa(t, r, s), s;
};
const Ve = class Ee {
  static readFileAsText(t, r) {
    return new TextDecoder().decode(Ee.readFileAsBuffer(t, r));
  }
  static readFileAsBuffer(t, r) {
    return t.readFile(r);
  }
  static writeFile(t, r, n) {
    t.writeFile(r, n);
  }
  static unlink(t, r) {
    t.unlink(r);
  }
  /**
   * Moves a file or directory in the PHP filesystem to a
   * new location.
   *
   * @param oldPath The path to rename.
   * @param newPath The new path.
   */
  static mv(t, r, n) {
    try {
      const s = t.lookupPath(r).node.mount, i = Ee.fileExists(t, n) ? t.lookupPath(n).node.mount : t.lookupPath(Gs(n)).node.mount;
      s.mountpoint !== i.mountpoint ? (Ee.copyRecursive(t, r, n), Ee.rmdir(t, r, { recursive: !0 })) : t.rename(r, n);
    } catch (s) {
      const i = na(s);
      throw i ? new Error(
        `Could not move ${r} to ${n}: ${i}`,
        {
          cause: s
        }
      ) : s;
    }
  }
  static rmdir(t, r, n = { recursive: !0 }) {
    n != null && n.recursive && Ee.listFiles(t, r).forEach((s) => {
      const i = `${r}/${s}`;
      Ee.isDir(t, i) ? Ee.rmdir(t, i, n) : Ee.unlink(t, i);
    }), t.rmdir(r);
  }
  static listFiles(t, r, n = { prependPath: !1 }) {
    if (!Ee.fileExists(t, r))
      return [];
    try {
      const s = t.readdir(r).filter(
        (i) => i !== "." && i !== ".."
      );
      if (n.prependPath) {
        const i = r.replace(/\/$/, "");
        return s.map((o) => `${i}/${o}`);
      }
      return s;
    } catch (s) {
      return he.error(s, { path: r }), [];
    }
  }
  static isDir(t, r) {
    return Ee.fileExists(t, r) ? t.isDir(t.lookupPath(r).node.mode) : !1;
  }
  /**
   * Checks if a file exists in the PHP filesystem.
   *
   * @param  path – The path to check.
   * @returns True if the path is a file, false otherwise.
   */
  static isFile(t, r) {
    return Ee.fileExists(t, r) ? t.isFile(t.lookupPath(r).node.mode) : !1;
  }
  static fileExists(t, r) {
    try {
      return t.lookupPath(r), !0;
    } catch {
      return !1;
    }
  }
  static mkdir(t, r) {
    t.mkdirTree(r);
  }
  static copyRecursive(t, r, n) {
    const s = t.lookupPath(r).node;
    if (t.isDir(s.mode)) {
      t.mkdirTree(n);
      const i = t.readdir(r).filter(
        (o) => o !== "." && o !== ".."
      );
      for (const o of i)
        Ee.copyRecursive(
          t,
          ue(r, o),
          ue(n, o)
        );
    } else
      t.writeFile(n, t.readFile(r));
  }
};
ze([
  Ue('Could not read "{path}"')
], Ve, "readFileAsText", 1);
ze([
  Ue('Could not read "{path}"')
], Ve, "readFileAsBuffer", 1);
ze([
  Ue('Could not write to "{path}"')
], Ve, "writeFile", 1);
ze([
  Ue('Could not unlink "{path}"')
], Ve, "unlink", 1);
ze([
  Ue('Could not remove directory "{path}"')
], Ve, "rmdir", 1);
ze([
  Ue('Could not list files in "{path}"')
], Ve, "listFiles", 1);
ze([
  Ue('Could not stat "{path}"')
], Ve, "isDir", 1);
ze([
  Ue('Could not stat "{path}"')
], Ve, "fileExists", 1);
ze([
  Ue('Could not create directory "{path}"')
], Ve, "mkdir", 1);
ze([
  Ue('Could not copy files from "{path}"')
], Ve, "copyRecursive", 1);
const oa = {
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
class br {
  constructor(t, r, n, s = "", i = 0) {
    this.httpStatusCode = t, this.headers = r, this.bytes = n, this.exitCode = i, this.errors = s;
  }
  static forHttpCode(t, r = "") {
    return new br(
      t,
      {},
      new TextEncoder().encode(
        r || oa[t] || ""
      )
    );
  }
  static fromRawData(t) {
    return new br(
      t.httpStatusCode,
      t.headers,
      t.bytes,
      t.errors,
      t.exitCode
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
  var e;
  return typeof process < "u" && ((e = process.release) == null ? void 0 : e.name) === "node" ? "NODE" : typeof window < "u" ? "WEB" : typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope ? "WORKER" : "NODE";
})();
const ys = "/internal/shared/php.ini";
var aa = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function ca(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
const { hasOwnProperty: Vr } = Object.prototype, en = (e, t = {}) => {
  typeof t == "string" && (t = { section: t }), t.align = t.align === !0, t.newline = t.newline === !0, t.sort = t.sort === !0, t.whitespace = t.whitespace === !0 || t.align === !0, t.platform = t.platform || typeof process < "u" && process.platform, t.bracketedArray = t.bracketedArray !== !1;
  const r = t.platform === "win32" ? `\r
` : `
`, n = t.whitespace ? " = " : "=", s = [], i = t.sort ? Object.keys(e).sort() : Object.keys(e);
  let o = 0;
  t.align && (o = He(
    i.filter((l) => e[l] === null || Array.isArray(e[l]) || typeof e[l] != "object").map((l) => Array.isArray(e[l]) ? `${l}[]` : l).concat([""]).reduce((l, d) => He(l).length >= He(d).length ? l : d)
  ).length);
  let u = "";
  const f = t.bracketedArray ? "[]" : "";
  for (const l of i) {
    const d = e[l];
    if (d && Array.isArray(d))
      for (const p of d)
        u += He(`${l}${f}`).padEnd(o, " ") + n + He(p) + r;
    else
      d && typeof d == "object" ? s.push(l) : u += He(l).padEnd(o, " ") + n + He(d) + r;
  }
  t.section && u.length && (u = "[" + He(t.section) + "]" + (t.newline ? r + r : r) + u);
  for (const l of s) {
    const d = oi(l, ".").join("\\."), p = (t.section ? t.section + "." : "") + d, _ = en(e[l], {
      ...t,
      section: p
    });
    u.length && _.length && (u += r), u += _;
  }
  return u;
};
function oi(e, t) {
  var r = 0, n = 0, s = 0, i = [];
  do
    if (s = e.indexOf(t, r), s !== -1) {
      if (r = s + t.length, s > 0 && e[s - 1] === "\\")
        continue;
      i.push(e.slice(n, s)), n = s + t.length;
    }
  while (s !== -1);
  return i.push(e.slice(n)), i;
}
const gs = (e, t = {}) => {
  t.bracketedArray = t.bracketedArray !== !1;
  const r = /* @__PURE__ */ Object.create(null);
  let n = r, s = null;
  const i = /^\[([^\]]*)\]\s*$|^([^=]+)(=(.*))?$/i, o = e.split(/[\r\n]+/g), u = {};
  for (const l of o) {
    if (!l || l.match(/^\s*[;#]/) || l.match(/^\s*$/))
      continue;
    const d = l.match(i);
    if (!d)
      continue;
    if (d[1] !== void 0) {
      if (s = pr(d[1]), s === "__proto__") {
        n = /* @__PURE__ */ Object.create(null);
        continue;
      }
      n = r[s] = r[s] || /* @__PURE__ */ Object.create(null);
      continue;
    }
    const p = pr(d[2]);
    let _;
    t.bracketedArray ? _ = p.length > 2 && p.slice(-2) === "[]" : (u[p] = ((u == null ? void 0 : u[p]) || 0) + 1, _ = u[p] > 1);
    const b = _ ? p.slice(0, -2) : p;
    if (b === "__proto__")
      continue;
    const P = d[3] ? pr(d[4]) : !0, O = P === "true" || P === "false" || P === "null" ? JSON.parse(P) : P;
    _ && (Vr.call(n, b) ? Array.isArray(n[b]) || (n[b] = [n[b]]) : n[b] = []), Array.isArray(n[b]) ? n[b].push(O) : n[b] = O;
  }
  const f = [];
  for (const l of Object.keys(r)) {
    if (!Vr.call(r, l) || typeof r[l] != "object" || Array.isArray(r[l]))
      continue;
    const d = oi(l, ".");
    n = r;
    const p = d.pop(), _ = p.replace(/\\\./g, ".");
    for (const b of d)
      b !== "__proto__" && ((!Vr.call(n, b) || typeof n[b] != "object") && (n[b] = /* @__PURE__ */ Object.create(null)), n = n[b]);
    n === r && _ === p || (n[_] = r[l], f.push(l));
  }
  for (const l of f)
    delete r[l];
  return r;
}, ai = (e) => e.startsWith('"') && e.endsWith('"') || e.startsWith("'") && e.endsWith("'"), He = (e) => typeof e != "string" || e.match(/[=\r\n]/) || e.match(/^\[/) || e.length > 1 && ai(e) || e !== e.trim() ? JSON.stringify(e) : e.split(";").join("\\;").split("#").join("\\#"), pr = (e) => {
  if (e = (e || "").trim(), ai(e)) {
    e.charAt(0) === "'" && (e = e.slice(1, -1));
    try {
      e = JSON.parse(e);
    } catch {
    }
  } else {
    let t = !1, r = "";
    for (let n = 0, s = e.length; n < s; n++) {
      const i = e.charAt(n);
      if (t)
        "\\;#".indexOf(i) !== -1 ? r += i : r += "\\" + i, t = !1;
      else {
        if (";#".indexOf(i) !== -1)
          break;
        i === "\\" ? t = !0 : r += i;
      }
    }
    return t && (r += "\\"), r.trim();
  }
  return e;
};
var $s = {
  parse: gs,
  decode: gs,
  stringify: en,
  encode: en,
  safe: He,
  unsafe: pr
};
async function Hd(e, t) {
  const r = $s.parse(await e.readFileAsText(ys));
  for (const [n, s] of Object.entries(t))
    s == null ? delete r[n] : r[n] = s;
  await e.writeFile(ys, $s.stringify(r));
}
ReadableStream.prototype[Symbol.asyncIterator] || (ReadableStream.prototype[Symbol.asyncIterator] = async function* () {
  const e = this.getReader();
  try {
    for (; ; ) {
      const { done: t, value: r } = await e.read();
      if (t)
        return;
      yield r;
    }
  } finally {
    e.releaseLock();
  }
}, ReadableStream.prototype.iterate = // @ts-ignore
ReadableStream.prototype[Symbol.asyncIterator]);
const fn = [
  "8.3",
  "8.2",
  "8.1",
  "8.0",
  "7.4",
  "7.3",
  "7.2",
  "7.1",
  "7.0"
], la = fn[0], Bd = fn, ci = [
  "iconv",
  "mbstring",
  "xml-bundle",
  "gd"
], _s = {
  "kitchen-sink": ci,
  light: []
}, ua = [
  "vfs",
  "literal",
  "wordpress.org/themes",
  "wordpress.org/plugins",
  "url"
];
function da(e) {
  return e && typeof e == "object" && typeof e.resource == "string" && ua.includes(e.resource);
}
class ft {
  /**
   * Creates a new Resource based on the given file reference
   *
   * @param ref The file reference to create the Resource for
   * @param options Additional options for the Resource
   * @returns A new Resource instance
   */
  static create(t, { semaphore: r, progress: n }) {
    let s;
    switch (t.resource) {
      case "vfs":
        s = new fa(t, n);
        break;
      case "literal":
        s = new pa(t, n);
        break;
      case "wordpress.org/themes":
        s = new ya(t, n);
        break;
      case "wordpress.org/plugins":
        s = new ga(t, n);
        break;
      case "url":
        s = new ma(t, n);
        break;
      default:
        throw new Error(`Invalid resource: ${t}`);
    }
    return s = new $a(s), r && (s = new _a(s, r)), s;
  }
  setPlayground(t) {
    this.playground = t;
  }
  /** Whether this Resource is loaded asynchronously */
  get isAsync() {
    return !1;
  }
}
class fa extends ft {
  /**
   * Creates a new instance of `VFSResource`.
   * @param playground The playground client.
   * @param resource The VFS reference.
   * @param progress The progress tracker.
   */
  constructor(t, r) {
    super(), this.resource = t, this.progress = r;
  }
  /** @inheritDoc */
  async resolve() {
    var r;
    const t = await this.playground.readFileAsBuffer(
      this.resource.path
    );
    return (r = this.progress) == null || r.set(100), new File([t], this.name);
  }
  /** @inheritDoc */
  get name() {
    return this.resource.path.split("/").pop() || "";
  }
}
class pa extends ft {
  /**
   * Creates a new instance of `LiteralResource`.
   * @param resource The literal reference.
   * @param progress The progress tracker.
   */
  constructor(t, r) {
    super(), this.resource = t, this.progress = r;
  }
  /** @inheritDoc */
  async resolve() {
    var t;
    return (t = this.progress) == null || t.set(100), new File([this.resource.contents], this.resource.name);
  }
  /** @inheritDoc */
  get name() {
    return this.resource.name;
  }
}
class pn extends ft {
  /**
   * Creates a new instance of `FetchResource`.
   * @param progress The progress tracker.
   */
  constructor(t) {
    super(), this.progress = t;
  }
  /** @inheritDoc */
  async resolve() {
    var r, n;
    (r = this.progress) == null || r.setCaption(this.caption);
    const t = this.getURL();
    try {
      let s = await fetch(t);
      if (!s.ok)
        throw new Error(`Could not download "${t}"`);
      if (s = await ra(
        s,
        ((n = this.progress) == null ? void 0 : n.loadingListener) ?? ha
      ), s.status !== 200)
        throw new Error(`Could not download "${t}"`);
      return new File([await s.blob()], this.name);
    } catch (s) {
      throw new Error(
        `Could not download "${t}".
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
				${s}`
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
const ha = () => {
};
class ma extends pn {
  /**
   * Creates a new instance of `UrlResource`.
   * @param resource The URL reference.
   * @param progress The progress tracker.
   */
  constructor(t, r) {
    super(r), this.resource = t;
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
class ya extends pn {
  constructor(t, r) {
    super(r), this.resource = t;
  }
  get name() {
    return Ir(this.resource.slug);
  }
  getURL() {
    return `https://downloads.wordpress.org/theme/${li(this.resource.slug)}`;
  }
}
class ga extends pn {
  constructor(t, r) {
    super(r), this.resource = t;
  }
  /** @inheritDoc */
  get name() {
    return Ir(this.resource.slug);
  }
  /** @inheritDoc */
  getURL() {
    return `https://downloads.wordpress.org/plugin/${li(this.resource.slug)}`;
  }
}
function li(e) {
  return !e || e.endsWith(".zip") ? e : e + ".latest-stable.zip";
}
class ui extends ft {
  constructor(t) {
    super(), this.resource = t;
  }
  /** @inheritDoc */
  async resolve() {
    return this.resource.resolve();
  }
  /** @inheritDoc */
  async setPlayground(t) {
    return this.resource.setPlayground(t);
  }
  /** @inheritDoc */
  get progress() {
    return this.resource.progress;
  }
  /** @inheritDoc */
  set progress(t) {
    this.resource.progress = t;
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
class $a extends ui {
  /** @inheritDoc */
  async resolve() {
    return this.promise || (this.promise = super.resolve()), this.promise;
  }
}
class _a extends ui {
  constructor(t, r) {
    super(t), this.semaphore = r;
  }
  /** @inheritDoc */
  async resolve() {
    return this.isAsync ? this.semaphore.run(() => super.resolve()) : super.resolve();
  }
}
var tn = { exports: {} }, di = {}, Ne = {}, kt = {}, Yt = {}, B = {}, Qt = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
  class t {
  }
  e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class r extends t {
    constructor($) {
      if (super(), !e.IDENTIFIER.test($))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = $;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      return !1;
    }
    get names() {
      return { [this.str]: 1 };
    }
  }
  e.Name = r;
  class n extends t {
    constructor($) {
      super(), this._items = typeof $ == "string" ? [$] : $;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      const $ = this._items[0];
      return $ === "" || $ === '""';
    }
    get str() {
      var $;
      return ($ = this._str) !== null && $ !== void 0 ? $ : this._str = this._items.reduce((S, I) => `${S}${I}`, "");
    }
    get names() {
      var $;
      return ($ = this._names) !== null && $ !== void 0 ? $ : this._names = this._items.reduce((S, I) => (I instanceof r && (S[I.str] = (S[I.str] || 0) + 1), S), {});
    }
  }
  e._Code = n, e.nil = new n("");
  function s(g, ...$) {
    const S = [g[0]];
    let I = 0;
    for (; I < $.length; )
      u(S, $[I]), S.push(g[++I]);
    return new n(S);
  }
  e._ = s;
  const i = new n("+");
  function o(g, ...$) {
    const S = [b(g[0])];
    let I = 0;
    for (; I < $.length; )
      S.push(i), u(S, $[I]), S.push(i, b(g[++I]));
    return f(S), new n(S);
  }
  e.str = o;
  function u(g, $) {
    $ instanceof n ? g.push(...$._items) : $ instanceof r ? g.push($) : g.push(p($));
  }
  e.addCodeArg = u;
  function f(g) {
    let $ = 1;
    for (; $ < g.length - 1; ) {
      if (g[$] === i) {
        const S = l(g[$ - 1], g[$ + 1]);
        if (S !== void 0) {
          g.splice($ - 1, 3, S);
          continue;
        }
        g[$++] = "+";
      }
      $++;
    }
  }
  function l(g, $) {
    if ($ === '""')
      return g;
    if (g === '""')
      return $;
    if (typeof g == "string")
      return $ instanceof r || g[g.length - 1] !== '"' ? void 0 : typeof $ != "string" ? `${g.slice(0, -1)}${$}"` : $[0] === '"' ? g.slice(0, -1) + $.slice(1) : void 0;
    if (typeof $ == "string" && $[0] === '"' && !(g instanceof r))
      return `"${g}${$.slice(1)}`;
  }
  function d(g, $) {
    return $.emptyStr() ? g : g.emptyStr() ? $ : o`${g}${$}`;
  }
  e.strConcat = d;
  function p(g) {
    return typeof g == "number" || typeof g == "boolean" || g === null ? g : b(Array.isArray(g) ? g.join(",") : g);
  }
  function _(g) {
    return new n(b(g));
  }
  e.stringify = _;
  function b(g) {
    return JSON.stringify(g).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  e.safeStringify = b;
  function P(g) {
    return typeof g == "string" && e.IDENTIFIER.test(g) ? new n(`.${g}`) : s`[${g}]`;
  }
  e.getProperty = P;
  function O(g) {
    if (typeof g == "string" && e.IDENTIFIER.test(g))
      return new n(`${g}`);
    throw new Error(`CodeGen: invalid export name: ${g}, use explicit $id name mapping`);
  }
  e.getEsmExportName = O;
  function w(g) {
    return new n(g.toString());
  }
  e.regexpCode = w;
})(Qt);
var rn = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = Qt;
  class r extends Error {
    constructor(l) {
      super(`CodeGen: "code" for ${l} not defined`), this.value = l.value;
    }
  }
  var n;
  (function(f) {
    f[f.Started = 0] = "Started", f[f.Completed = 1] = "Completed";
  })(n = e.UsedValueState || (e.UsedValueState = {})), e.varKinds = {
    const: new t.Name("const"),
    let: new t.Name("let"),
    var: new t.Name("var")
  };
  class s {
    constructor({ prefixes: l, parent: d } = {}) {
      this._names = {}, this._prefixes = l, this._parent = d;
    }
    toName(l) {
      return l instanceof t.Name ? l : this.name(l);
    }
    name(l) {
      return new t.Name(this._newName(l));
    }
    _newName(l) {
      const d = this._names[l] || this._nameGroup(l);
      return `${l}${d.index++}`;
    }
    _nameGroup(l) {
      var d, p;
      if (!((p = (d = this._parent) === null || d === void 0 ? void 0 : d._prefixes) === null || p === void 0) && p.has(l) || this._prefixes && !this._prefixes.has(l))
        throw new Error(`CodeGen: prefix "${l}" is not allowed in this scope`);
      return this._names[l] = { prefix: l, index: 0 };
    }
  }
  e.Scope = s;
  class i extends t.Name {
    constructor(l, d) {
      super(d), this.prefix = l;
    }
    setValue(l, { property: d, itemIndex: p }) {
      this.value = l, this.scopePath = (0, t._)`.${new t.Name(d)}[${p}]`;
    }
  }
  e.ValueScopeName = i;
  const o = (0, t._)`\n`;
  class u extends s {
    constructor(l) {
      super(l), this._values = {}, this._scope = l.scope, this.opts = { ...l, _n: l.lines ? o : t.nil };
    }
    get() {
      return this._scope;
    }
    name(l) {
      return new i(l, this._newName(l));
    }
    value(l, d) {
      var p;
      if (d.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const _ = this.toName(l), { prefix: b } = _, P = (p = d.key) !== null && p !== void 0 ? p : d.ref;
      let O = this._values[b];
      if (O) {
        const $ = O.get(P);
        if ($)
          return $;
      } else
        O = this._values[b] = /* @__PURE__ */ new Map();
      O.set(P, _);
      const w = this._scope[b] || (this._scope[b] = []), g = w.length;
      return w[g] = d.ref, _.setValue(d, { property: b, itemIndex: g }), _;
    }
    getValue(l, d) {
      const p = this._values[l];
      if (p)
        return p.get(d);
    }
    scopeRefs(l, d = this._values) {
      return this._reduceValues(d, (p) => {
        if (p.scopePath === void 0)
          throw new Error(`CodeGen: name "${p}" has no value`);
        return (0, t._)`${l}${p.scopePath}`;
      });
    }
    scopeCode(l = this._values, d, p) {
      return this._reduceValues(l, (_) => {
        if (_.value === void 0)
          throw new Error(`CodeGen: name "${_}" has no value`);
        return _.value.code;
      }, d, p);
    }
    _reduceValues(l, d, p = {}, _) {
      let b = t.nil;
      for (const P in l) {
        const O = l[P];
        if (!O)
          continue;
        const w = p[P] = p[P] || /* @__PURE__ */ new Map();
        O.forEach((g) => {
          if (w.has(g))
            return;
          w.set(g, n.Started);
          let $ = d(g);
          if ($) {
            const S = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
            b = (0, t._)`${b}${S} ${g} = ${$};${this.opts._n}`;
          } else if ($ = _ == null ? void 0 : _(g))
            b = (0, t._)`${b}${$}${this.opts._n}`;
          else
            throw new r(g);
          w.set(g, n.Completed);
        });
      }
      return b;
    }
  }
  e.ValueScope = u;
})(rn);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = Qt, r = rn;
  var n = Qt;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return n._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return n.str;
  } }), Object.defineProperty(e, "strConcat", { enumerable: !0, get: function() {
    return n.strConcat;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return n.nil;
  } }), Object.defineProperty(e, "getProperty", { enumerable: !0, get: function() {
    return n.getProperty;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return n.stringify;
  } }), Object.defineProperty(e, "regexpCode", { enumerable: !0, get: function() {
    return n.regexpCode;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return n.Name;
  } });
  var s = rn;
  Object.defineProperty(e, "Scope", { enumerable: !0, get: function() {
    return s.Scope;
  } }), Object.defineProperty(e, "ValueScope", { enumerable: !0, get: function() {
    return s.ValueScope;
  } }), Object.defineProperty(e, "ValueScopeName", { enumerable: !0, get: function() {
    return s.ValueScopeName;
  } }), Object.defineProperty(e, "varKinds", { enumerable: !0, get: function() {
    return s.varKinds;
  } }), e.operators = {
    GT: new t._Code(">"),
    GTE: new t._Code(">="),
    LT: new t._Code("<"),
    LTE: new t._Code("<="),
    EQ: new t._Code("==="),
    NEQ: new t._Code("!=="),
    NOT: new t._Code("!"),
    OR: new t._Code("||"),
    AND: new t._Code("&&"),
    ADD: new t._Code("+")
  };
  class i {
    optimizeNodes() {
      return this;
    }
    optimizeNames(a, m) {
      return this;
    }
  }
  class o extends i {
    constructor(a, m, N) {
      super(), this.varKind = a, this.name = m, this.rhs = N;
    }
    render({ es5: a, _n: m }) {
      const N = a ? r.varKinds.var : this.varKind, L = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${N} ${this.name}${L};` + m;
    }
    optimizeNames(a, m) {
      if (a[this.name.str])
        return this.rhs && (this.rhs = fe(this.rhs, a, m)), this;
    }
    get names() {
      return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
    }
  }
  class u extends i {
    constructor(a, m, N) {
      super(), this.lhs = a, this.rhs = m, this.sideEffects = N;
    }
    render({ _n: a }) {
      return `${this.lhs} = ${this.rhs};` + a;
    }
    optimizeNames(a, m) {
      if (!(this.lhs instanceof t.Name && !a[this.lhs.str] && !this.sideEffects))
        return this.rhs = fe(this.rhs, a, m), this;
    }
    get names() {
      const a = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
      return Pe(a, this.rhs);
    }
  }
  class f extends u {
    constructor(a, m, N, L) {
      super(a, N, L), this.op = m;
    }
    render({ _n: a }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + a;
    }
  }
  class l extends i {
    constructor(a) {
      super(), this.label = a, this.names = {};
    }
    render({ _n: a }) {
      return `${this.label}:` + a;
    }
  }
  class d extends i {
    constructor(a) {
      super(), this.label = a, this.names = {};
    }
    render({ _n: a }) {
      return `break${this.label ? ` ${this.label}` : ""};` + a;
    }
  }
  class p extends i {
    constructor(a) {
      super(), this.error = a;
    }
    render({ _n: a }) {
      return `throw ${this.error};` + a;
    }
    get names() {
      return this.error.names;
    }
  }
  class _ extends i {
    constructor(a) {
      super(), this.code = a;
    }
    render({ _n: a }) {
      return `${this.code};` + a;
    }
    optimizeNodes() {
      return `${this.code}` ? this : void 0;
    }
    optimizeNames(a, m) {
      return this.code = fe(this.code, a, m), this;
    }
    get names() {
      return this.code instanceof t._CodeOrName ? this.code.names : {};
    }
  }
  class b extends i {
    constructor(a = []) {
      super(), this.nodes = a;
    }
    render(a) {
      return this.nodes.reduce((m, N) => m + N.render(a), "");
    }
    optimizeNodes() {
      const { nodes: a } = this;
      let m = a.length;
      for (; m--; ) {
        const N = a[m].optimizeNodes();
        Array.isArray(N) ? a.splice(m, 1, ...N) : N ? a[m] = N : a.splice(m, 1);
      }
      return a.length > 0 ? this : void 0;
    }
    optimizeNames(a, m) {
      const { nodes: N } = this;
      let L = N.length;
      for (; L--; ) {
        const F = N[L];
        F.optimizeNames(a, m) || (Xe(a, F.names), N.splice(L, 1));
      }
      return N.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((a, m) => Y(a, m.names), {});
    }
  }
  class P extends b {
    render(a) {
      return "{" + a._n + super.render(a) + "}" + a._n;
    }
  }
  class O extends b {
  }
  class w extends P {
  }
  w.kind = "else";
  class g extends P {
    constructor(a, m) {
      super(m), this.condition = a;
    }
    render(a) {
      let m = `if(${this.condition})` + super.render(a);
      return this.else && (m += "else " + this.else.render(a)), m;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const a = this.condition;
      if (a === !0)
        return this.nodes;
      let m = this.else;
      if (m) {
        const N = m.optimizeNodes();
        m = this.else = Array.isArray(N) ? new w(N) : N;
      }
      if (m)
        return a === !1 ? m instanceof g ? m : m.nodes : this.nodes.length ? this : new g(et(a), m instanceof g ? [m] : m.nodes);
      if (!(a === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(a, m) {
      var N;
      if (this.else = (N = this.else) === null || N === void 0 ? void 0 : N.optimizeNames(a, m), !!(super.optimizeNames(a, m) || this.else))
        return this.condition = fe(this.condition, a, m), this;
    }
    get names() {
      const a = super.names;
      return Pe(a, this.condition), this.else && Y(a, this.else.names), a;
    }
  }
  g.kind = "if";
  class $ extends P {
  }
  $.kind = "for";
  class S extends $ {
    constructor(a) {
      super(), this.iteration = a;
    }
    render(a) {
      return `for(${this.iteration})` + super.render(a);
    }
    optimizeNames(a, m) {
      if (super.optimizeNames(a, m))
        return this.iteration = fe(this.iteration, a, m), this;
    }
    get names() {
      return Y(super.names, this.iteration.names);
    }
  }
  class I extends $ {
    constructor(a, m, N, L) {
      super(), this.varKind = a, this.name = m, this.from = N, this.to = L;
    }
    render(a) {
      const m = a.es5 ? r.varKinds.var : this.varKind, { name: N, from: L, to: F } = this;
      return `for(${m} ${N}=${L}; ${N}<${F}; ${N}++)` + super.render(a);
    }
    get names() {
      const a = Pe(super.names, this.from);
      return Pe(a, this.to);
    }
  }
  class D extends $ {
    constructor(a, m, N, L) {
      super(), this.loop = a, this.varKind = m, this.name = N, this.iterable = L;
    }
    render(a) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(a);
    }
    optimizeNames(a, m) {
      if (super.optimizeNames(a, m))
        return this.iterable = fe(this.iterable, a, m), this;
    }
    get names() {
      return Y(super.names, this.iterable.names);
    }
  }
  class E extends P {
    constructor(a, m, N) {
      super(), this.name = a, this.args = m, this.async = N;
    }
    render(a) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(a);
    }
  }
  E.kind = "func";
  class C extends b {
    render(a) {
      return "return " + super.render(a);
    }
  }
  C.kind = "return";
  class A extends P {
    render(a) {
      let m = "try" + super.render(a);
      return this.catch && (m += this.catch.render(a)), this.finally && (m += this.finally.render(a)), m;
    }
    optimizeNodes() {
      var a, m;
      return super.optimizeNodes(), (a = this.catch) === null || a === void 0 || a.optimizeNodes(), (m = this.finally) === null || m === void 0 || m.optimizeNodes(), this;
    }
    optimizeNames(a, m) {
      var N, L;
      return super.optimizeNames(a, m), (N = this.catch) === null || N === void 0 || N.optimizeNames(a, m), (L = this.finally) === null || L === void 0 || L.optimizeNames(a, m), this;
    }
    get names() {
      const a = super.names;
      return this.catch && Y(a, this.catch.names), this.finally && Y(a, this.finally.names), a;
    }
  }
  class W extends P {
    constructor(a) {
      super(), this.error = a;
    }
    render(a) {
      return `catch(${this.error})` + super.render(a);
    }
  }
  W.kind = "catch";
  class G extends P {
    render(a) {
      return "finally" + super.render(a);
    }
  }
  G.kind = "finally";
  class ie {
    constructor(a, m = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...m, _n: m.lines ? `
` : "" }, this._extScope = a, this._scope = new r.Scope({ parent: a }), this._nodes = [new O()];
    }
    toString() {
      return this._root.render(this.opts);
    }
    // returns unique name in the internal scope
    name(a) {
      return this._scope.name(a);
    }
    // reserves unique name in the external scope
    scopeName(a) {
      return this._extScope.name(a);
    }
    // reserves unique name in the external scope and assigns value to it
    scopeValue(a, m) {
      const N = this._extScope.value(a, m);
      return (this._values[N.prefix] || (this._values[N.prefix] = /* @__PURE__ */ new Set())).add(N), N;
    }
    getScopeValue(a, m) {
      return this._extScope.getValue(a, m);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs(a) {
      return this._extScope.scopeRefs(a, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(a, m, N, L) {
      const F = this._scope.toName(m);
      return N !== void 0 && L && (this._constants[F.str] = N), this._leafNode(new o(a, F, N)), F;
    }
    // `const` declaration (`var` in es5 mode)
    const(a, m, N) {
      return this._def(r.varKinds.const, a, m, N);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(a, m, N) {
      return this._def(r.varKinds.let, a, m, N);
    }
    // `var` declaration with optional assignment
    var(a, m, N) {
      return this._def(r.varKinds.var, a, m, N);
    }
    // assignment code
    assign(a, m, N) {
      return this._leafNode(new u(a, m, N));
    }
    // `+=` code
    add(a, m) {
      return this._leafNode(new f(a, e.operators.ADD, m));
    }
    // appends passed SafeExpr to code or executes Block
    code(a) {
      return typeof a == "function" ? a() : a !== t.nil && this._leafNode(new _(a)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...a) {
      const m = ["{"];
      for (const [N, L] of a)
        m.length > 1 && m.push(","), m.push(N), (N !== L || this.opts.es5) && (m.push(":"), (0, t.addCodeArg)(m, L));
      return m.push("}"), new t._Code(m);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(a, m, N) {
      if (this._blockNode(new g(a)), m && N)
        this.code(m).else().code(N).endIf();
      else if (m)
        this.code(m).endIf();
      else if (N)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf(a) {
      return this._elseNode(new g(a));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new w());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(g, w);
    }
    _for(a, m) {
      return this._blockNode(a), m && this.code(m).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(a, m) {
      return this._for(new S(a), m);
    }
    // `for` statement for a range of values
    forRange(a, m, N, L, F = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const K = this._scope.toName(a);
      return this._for(new I(F, K, m, N), () => L(K));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(a, m, N, L = r.varKinds.const) {
      const F = this._scope.toName(a);
      if (this.opts.es5) {
        const K = m instanceof t.Name ? m : this.var("_arr", m);
        return this.forRange("_i", 0, (0, t._)`${K}.length`, (Q) => {
          this.var(F, (0, t._)`${K}[${Q}]`), N(F);
        });
      }
      return this._for(new D("of", L, F, m), () => N(F));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(a, m, N, L = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(a, (0, t._)`Object.keys(${m})`, N);
      const F = this._scope.toName(a);
      return this._for(new D("in", L, F, m), () => N(F));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode($);
    }
    // `label` statement
    label(a) {
      return this._leafNode(new l(a));
    }
    // `break` statement
    break(a) {
      return this._leafNode(new d(a));
    }
    // `return` statement
    return(a) {
      const m = new C();
      if (this._blockNode(m), this.code(a), m.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(C);
    }
    // `try` statement
    try(a, m, N) {
      if (!m && !N)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const L = new A();
      if (this._blockNode(L), this.code(a), m) {
        const F = this.name("e");
        this._currNode = L.catch = new W(F), m(F);
      }
      return N && (this._currNode = L.finally = new G(), this.code(N)), this._endBlockNode(W, G);
    }
    // `throw` statement
    throw(a) {
      return this._leafNode(new p(a));
    }
    // start self-balancing block
    block(a, m) {
      return this._blockStarts.push(this._nodes.length), a && this.code(a).endBlock(m), this;
    }
    // end the current self-balancing block
    endBlock(a) {
      const m = this._blockStarts.pop();
      if (m === void 0)
        throw new Error("CodeGen: not in self-balancing block");
      const N = this._nodes.length - m;
      if (N < 0 || a !== void 0 && N !== a)
        throw new Error(`CodeGen: wrong number of nodes: ${N} vs ${a} expected`);
      return this._nodes.length = m, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(a, m = t.nil, N, L) {
      return this._blockNode(new E(a, m, N)), L && this.code(L).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(E);
    }
    optimize(a = 1) {
      for (; a-- > 0; )
        this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
    }
    _leafNode(a) {
      return this._currNode.nodes.push(a), this;
    }
    _blockNode(a) {
      this._currNode.nodes.push(a), this._nodes.push(a);
    }
    _endBlockNode(a, m) {
      const N = this._currNode;
      if (N instanceof a || m && N instanceof m)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${m ? `${a.kind}/${m.kind}` : a.kind}"`);
    }
    _elseNode(a) {
      const m = this._currNode;
      if (!(m instanceof g))
        throw new Error('CodeGen: "else" without "if"');
      return this._currNode = m.else = a, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const a = this._nodes;
      return a[a.length - 1];
    }
    set _currNode(a) {
      const m = this._nodes;
      m[m.length - 1] = a;
    }
  }
  e.CodeGen = ie;
  function Y(T, a) {
    for (const m in a)
      T[m] = (T[m] || 0) + (a[m] || 0);
    return T;
  }
  function Pe(T, a) {
    return a instanceof t._CodeOrName ? Y(T, a.names) : T;
  }
  function fe(T, a, m) {
    if (T instanceof t.Name)
      return N(T);
    if (!L(T))
      return T;
    return new t._Code(T._items.reduce((F, K) => (K instanceof t.Name && (K = N(K)), K instanceof t._Code ? F.push(...K._items) : F.push(K), F), []));
    function N(F) {
      const K = m[F.str];
      return K === void 0 || a[F.str] !== 1 ? F : (delete a[F.str], K);
    }
    function L(F) {
      return F instanceof t._Code && F._items.some((K) => K instanceof t.Name && a[K.str] === 1 && m[K.str] !== void 0);
    }
  }
  function Xe(T, a) {
    for (const m in a)
      T[m] = (T[m] || 0) - (a[m] || 0);
  }
  function et(T) {
    return typeof T == "boolean" || typeof T == "number" || T === null ? !T : (0, t._)`!${j(T)}`;
  }
  e.not = et;
  const pt = v(e.operators.AND);
  function It(...T) {
    return T.reduce(pt);
  }
  e.and = It;
  const ht = v(e.operators.OR);
  function M(...T) {
    return T.reduce(ht);
  }
  e.or = M;
  function v(T) {
    return (a, m) => a === t.nil ? m : m === t.nil ? a : (0, t._)`${j(a)} ${T} ${j(m)}`;
  }
  function j(T) {
    return T instanceof t.Name ? T : (0, t._)`(${T})`;
  }
})(B);
var X = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.checkStrictMode = e.getErrorPath = e.Type = e.useFunc = e.setEvaluated = e.evaluatedPropsToName = e.mergeEvaluated = e.eachItem = e.unescapeJsonPointer = e.escapeJsonPointer = e.escapeFragment = e.unescapeFragment = e.schemaRefOrVal = e.schemaHasRulesButRef = e.schemaHasRules = e.checkUnknownRules = e.alwaysValidSchema = e.toHash = void 0;
  const t = B, r = Qt;
  function n(E) {
    const C = {};
    for (const A of E)
      C[A] = !0;
    return C;
  }
  e.toHash = n;
  function s(E, C) {
    return typeof C == "boolean" ? C : Object.keys(C).length === 0 ? !0 : (i(E, C), !o(C, E.self.RULES.all));
  }
  e.alwaysValidSchema = s;
  function i(E, C = E.schema) {
    const { opts: A, self: W } = E;
    if (!A.strictSchema || typeof C == "boolean")
      return;
    const G = W.RULES.keywords;
    for (const ie in C)
      G[ie] || D(E, `unknown keyword: "${ie}"`);
  }
  e.checkUnknownRules = i;
  function o(E, C) {
    if (typeof E == "boolean")
      return !E;
    for (const A in E)
      if (C[A])
        return !0;
    return !1;
  }
  e.schemaHasRules = o;
  function u(E, C) {
    if (typeof E == "boolean")
      return !E;
    for (const A in E)
      if (A !== "$ref" && C.all[A])
        return !0;
    return !1;
  }
  e.schemaHasRulesButRef = u;
  function f({ topSchemaRef: E, schemaPath: C }, A, W, G) {
    if (!G) {
      if (typeof A == "number" || typeof A == "boolean")
        return A;
      if (typeof A == "string")
        return (0, t._)`${A}`;
    }
    return (0, t._)`${E}${C}${(0, t.getProperty)(W)}`;
  }
  e.schemaRefOrVal = f;
  function l(E) {
    return _(decodeURIComponent(E));
  }
  e.unescapeFragment = l;
  function d(E) {
    return encodeURIComponent(p(E));
  }
  e.escapeFragment = d;
  function p(E) {
    return typeof E == "number" ? `${E}` : E.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  e.escapeJsonPointer = p;
  function _(E) {
    return E.replace(/~1/g, "/").replace(/~0/g, "~");
  }
  e.unescapeJsonPointer = _;
  function b(E, C) {
    if (Array.isArray(E))
      for (const A of E)
        C(A);
    else
      C(E);
  }
  e.eachItem = b;
  function P({ mergeNames: E, mergeToName: C, mergeValues: A, resultToName: W }) {
    return (G, ie, Y, Pe) => {
      const fe = Y === void 0 ? ie : Y instanceof t.Name ? (ie instanceof t.Name ? E(G, ie, Y) : C(G, ie, Y), Y) : ie instanceof t.Name ? (C(G, Y, ie), ie) : A(ie, Y);
      return Pe === t.Name && !(fe instanceof t.Name) ? W(G, fe) : fe;
    };
  }
  e.mergeEvaluated = {
    props: P({
      mergeNames: (E, C, A) => E.if((0, t._)`${A} !== true && ${C} !== undefined`, () => {
        E.if((0, t._)`${C} === true`, () => E.assign(A, !0), () => E.assign(A, (0, t._)`${A} || {}`).code((0, t._)`Object.assign(${A}, ${C})`));
      }),
      mergeToName: (E, C, A) => E.if((0, t._)`${A} !== true`, () => {
        C === !0 ? E.assign(A, !0) : (E.assign(A, (0, t._)`${A} || {}`), w(E, A, C));
      }),
      mergeValues: (E, C) => E === !0 ? !0 : { ...E, ...C },
      resultToName: O
    }),
    items: P({
      mergeNames: (E, C, A) => E.if((0, t._)`${A} !== true && ${C} !== undefined`, () => E.assign(A, (0, t._)`${C} === true ? true : ${A} > ${C} ? ${A} : ${C}`)),
      mergeToName: (E, C, A) => E.if((0, t._)`${A} !== true`, () => E.assign(A, C === !0 ? !0 : (0, t._)`${A} > ${C} ? ${A} : ${C}`)),
      mergeValues: (E, C) => E === !0 ? !0 : Math.max(E, C),
      resultToName: (E, C) => E.var("items", C)
    })
  };
  function O(E, C) {
    if (C === !0)
      return E.var("props", !0);
    const A = E.var("props", (0, t._)`{}`);
    return C !== void 0 && w(E, A, C), A;
  }
  e.evaluatedPropsToName = O;
  function w(E, C, A) {
    Object.keys(A).forEach((W) => E.assign((0, t._)`${C}${(0, t.getProperty)(W)}`, !0));
  }
  e.setEvaluated = w;
  const g = {};
  function $(E, C) {
    return E.scopeValue("func", {
      ref: C,
      code: g[C.code] || (g[C.code] = new r._Code(C.code))
    });
  }
  e.useFunc = $;
  var S;
  (function(E) {
    E[E.Num = 0] = "Num", E[E.Str = 1] = "Str";
  })(S = e.Type || (e.Type = {}));
  function I(E, C, A) {
    if (E instanceof t.Name) {
      const W = C === S.Num;
      return A ? W ? (0, t._)`"[" + ${E} + "]"` : (0, t._)`"['" + ${E} + "']"` : W ? (0, t._)`"/" + ${E}` : (0, t._)`"/" + ${E}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
    }
    return A ? (0, t.getProperty)(E).toString() : "/" + p(E);
  }
  e.getErrorPath = I;
  function D(E, C, A = E.opts.strictSchema) {
    if (A) {
      if (C = `strict mode: ${C}`, A === !0)
        throw new Error(C);
      E.self.logger.warn(C);
    }
  }
  e.checkStrictMode = D;
})(X);
var We = {};
Object.defineProperty(We, "__esModule", { value: !0 });
const ge = B, wa = {
  // validation function arguments
  data: new ge.Name("data"),
  // args passed from referencing schema
  valCxt: new ge.Name("valCxt"),
  instancePath: new ge.Name("instancePath"),
  parentData: new ge.Name("parentData"),
  parentDataProperty: new ge.Name("parentDataProperty"),
  rootData: new ge.Name("rootData"),
  dynamicAnchors: new ge.Name("dynamicAnchors"),
  // function scoped variables
  vErrors: new ge.Name("vErrors"),
  errors: new ge.Name("errors"),
  this: new ge.Name("this"),
  // "globals"
  self: new ge.Name("self"),
  scope: new ge.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new ge.Name("json"),
  jsonPos: new ge.Name("jsonPos"),
  jsonLen: new ge.Name("jsonLen"),
  jsonPart: new ge.Name("jsonPart")
};
We.default = wa;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = B, r = X, n = We;
  e.keywordError = {
    message: ({ keyword: w }) => (0, t.str)`must pass "${w}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: w, schemaType: g }) => g ? (0, t.str)`"${w}" keyword must be ${g} ($data)` : (0, t.str)`"${w}" keyword is invalid ($data)`
  };
  function s(w, g = e.keywordError, $, S) {
    const { it: I } = w, { gen: D, compositeRule: E, allErrors: C } = I, A = p(w, g, $);
    S ?? (E || C) ? f(D, A) : l(I, (0, t._)`[${A}]`);
  }
  e.reportError = s;
  function i(w, g = e.keywordError, $) {
    const { it: S } = w, { gen: I, compositeRule: D, allErrors: E } = S, C = p(w, g, $);
    f(I, C), D || E || l(S, n.default.vErrors);
  }
  e.reportExtraError = i;
  function o(w, g) {
    w.assign(n.default.errors, g), w.if((0, t._)`${n.default.vErrors} !== null`, () => w.if(g, () => w.assign((0, t._)`${n.default.vErrors}.length`, g), () => w.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = o;
  function u({ gen: w, keyword: g, schemaValue: $, data: S, errsCount: I, it: D }) {
    if (I === void 0)
      throw new Error("ajv implementation error");
    const E = w.name("err");
    w.forRange("i", I, n.default.errors, (C) => {
      w.const(E, (0, t._)`${n.default.vErrors}[${C}]`), w.if((0, t._)`${E}.instancePath === undefined`, () => w.assign((0, t._)`${E}.instancePath`, (0, t.strConcat)(n.default.instancePath, D.errorPath))), w.assign((0, t._)`${E}.schemaPath`, (0, t.str)`${D.errSchemaPath}/${g}`), D.opts.verbose && (w.assign((0, t._)`${E}.schema`, $), w.assign((0, t._)`${E}.data`, S));
    });
  }
  e.extendErrors = u;
  function f(w, g) {
    const $ = w.const("err", g);
    w.if((0, t._)`${n.default.vErrors} === null`, () => w.assign(n.default.vErrors, (0, t._)`[${$}]`), (0, t._)`${n.default.vErrors}.push(${$})`), w.code((0, t._)`${n.default.errors}++`);
  }
  function l(w, g) {
    const { gen: $, validateName: S, schemaEnv: I } = w;
    I.$async ? $.throw((0, t._)`new ${w.ValidationError}(${g})`) : ($.assign((0, t._)`${S}.errors`, g), $.return(!1));
  }
  const d = {
    keyword: new t.Name("keyword"),
    schemaPath: new t.Name("schemaPath"),
    params: new t.Name("params"),
    propertyName: new t.Name("propertyName"),
    message: new t.Name("message"),
    schema: new t.Name("schema"),
    parentSchema: new t.Name("parentSchema")
  };
  function p(w, g, $) {
    const { createErrors: S } = w.it;
    return S === !1 ? (0, t._)`{}` : _(w, g, $);
  }
  function _(w, g, $ = {}) {
    const { gen: S, it: I } = w, D = [
      b(I, $),
      P(w, $)
    ];
    return O(w, g, D), S.object(...D);
  }
  function b({ errorPath: w }, { instancePath: g }) {
    const $ = g ? (0, t.str)`${w}${(0, r.getErrorPath)(g, r.Type.Str)}` : w;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, $)];
  }
  function P({ keyword: w, it: { errSchemaPath: g } }, { schemaPath: $, parentSchema: S }) {
    let I = S ? g : (0, t.str)`${g}/${w}`;
    return $ && (I = (0, t.str)`${I}${(0, r.getErrorPath)($, r.Type.Str)}`), [d.schemaPath, I];
  }
  function O(w, { params: g, message: $ }, S) {
    const { keyword: I, data: D, schemaValue: E, it: C } = w, { opts: A, propertyName: W, topSchemaRef: G, schemaPath: ie } = C;
    S.push([d.keyword, I], [d.params, typeof g == "function" ? g(w) : g || (0, t._)`{}`]), A.messages && S.push([d.message, typeof $ == "function" ? $(w) : $]), A.verbose && S.push([d.schema, E], [d.parentSchema, (0, t._)`${G}${ie}`], [n.default.data, D]), W && S.push([d.propertyName, W]);
  }
})(Yt);
Object.defineProperty(kt, "__esModule", { value: !0 });
kt.boolOrEmptySchema = kt.topBoolOrEmptySchema = void 0;
const va = Yt, ba = B, Ea = We, Pa = {
  message: "boolean schema is false"
};
function Sa(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? fi(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(Ea.default.data) : (t.assign((0, ba._)`${n}.errors`, null), t.return(!0));
}
kt.topBoolOrEmptySchema = Sa;
function Ta(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), fi(e)) : r.var(t, !0);
}
kt.boolOrEmptySchema = Ta;
function fi(e, t) {
  const { gen: r, data: n } = e, s = {
    gen: r,
    keyword: "false schema",
    data: n,
    schema: !1,
    schemaCode: !1,
    schemaValue: !1,
    params: {},
    it: e
  };
  (0, va.reportError)(s, Pa, void 0, t);
}
var Zt = {}, ut = {};
Object.defineProperty(ut, "__esModule", { value: !0 });
ut.getRules = ut.isJSONType = void 0;
const Ra = ["string", "number", "integer", "boolean", "null", "object", "array"], ka = new Set(Ra);
function Oa(e) {
  return typeof e == "string" && ka.has(e);
}
ut.isJSONType = Oa;
function Ca() {
  const e = {
    number: { type: "number", rules: [] },
    string: { type: "string", rules: [] },
    array: { type: "array", rules: [] },
    object: { type: "object", rules: [] }
  };
  return {
    types: { ...e, integer: !0, boolean: !0, null: !0 },
    rules: [{ rules: [] }, e.number, e.string, e.array, e.object],
    post: { rules: [] },
    all: {},
    keywords: {}
  };
}
ut.getRules = Ca;
var Be = {};
Object.defineProperty(Be, "__esModule", { value: !0 });
Be.shouldUseRule = Be.shouldUseGroup = Be.schemaHasRulesForType = void 0;
function Na({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && pi(e, n);
}
Be.schemaHasRulesForType = Na;
function pi(e, t) {
  return t.rules.some((r) => hi(e, r));
}
Be.shouldUseGroup = pi;
function hi(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
Be.shouldUseRule = hi;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.reportTypeError = e.checkDataTypes = e.checkDataType = e.coerceAndCheckDataType = e.getJSONTypes = e.getSchemaTypes = e.DataType = void 0;
  const t = ut, r = Be, n = Yt, s = B, i = X;
  var o;
  (function(S) {
    S[S.Correct = 0] = "Correct", S[S.Wrong = 1] = "Wrong";
  })(o = e.DataType || (e.DataType = {}));
  function u(S) {
    const I = f(S.type);
    if (I.includes("null")) {
      if (S.nullable === !1)
        throw new Error("type: null contradicts nullable: false");
    } else {
      if (!I.length && S.nullable !== void 0)
        throw new Error('"nullable" cannot be used without "type"');
      S.nullable === !0 && I.push("null");
    }
    return I;
  }
  e.getSchemaTypes = u;
  function f(S) {
    const I = Array.isArray(S) ? S : S ? [S] : [];
    if (I.every(t.isJSONType))
      return I;
    throw new Error("type must be JSONType or JSONType[]: " + I.join(","));
  }
  e.getJSONTypes = f;
  function l(S, I) {
    const { gen: D, data: E, opts: C } = S, A = p(I, C.coerceTypes), W = I.length > 0 && !(A.length === 0 && I.length === 1 && (0, r.schemaHasRulesForType)(S, I[0]));
    if (W) {
      const G = O(I, E, C.strictNumbers, o.Wrong);
      D.if(G, () => {
        A.length ? _(S, I, A) : g(S);
      });
    }
    return W;
  }
  e.coerceAndCheckDataType = l;
  const d = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
  function p(S, I) {
    return I ? S.filter((D) => d.has(D) || I === "array" && D === "array") : [];
  }
  function _(S, I, D) {
    const { gen: E, data: C, opts: A } = S, W = E.let("dataType", (0, s._)`typeof ${C}`), G = E.let("coerced", (0, s._)`undefined`);
    A.coerceTypes === "array" && E.if((0, s._)`${W} == 'object' && Array.isArray(${C}) && ${C}.length == 1`, () => E.assign(C, (0, s._)`${C}[0]`).assign(W, (0, s._)`typeof ${C}`).if(O(I, C, A.strictNumbers), () => E.assign(G, C))), E.if((0, s._)`${G} !== undefined`);
    for (const Y of D)
      (d.has(Y) || Y === "array" && A.coerceTypes === "array") && ie(Y);
    E.else(), g(S), E.endIf(), E.if((0, s._)`${G} !== undefined`, () => {
      E.assign(C, G), b(S, G);
    });
    function ie(Y) {
      switch (Y) {
        case "string":
          E.elseIf((0, s._)`${W} == "number" || ${W} == "boolean"`).assign(G, (0, s._)`"" + ${C}`).elseIf((0, s._)`${C} === null`).assign(G, (0, s._)`""`);
          return;
        case "number":
          E.elseIf((0, s._)`${W} == "boolean" || ${C} === null
              || (${W} == "string" && ${C} && ${C} == +${C})`).assign(G, (0, s._)`+${C}`);
          return;
        case "integer":
          E.elseIf((0, s._)`${W} === "boolean" || ${C} === null
              || (${W} === "string" && ${C} && ${C} == +${C} && !(${C} % 1))`).assign(G, (0, s._)`+${C}`);
          return;
        case "boolean":
          E.elseIf((0, s._)`${C} === "false" || ${C} === 0 || ${C} === null`).assign(G, !1).elseIf((0, s._)`${C} === "true" || ${C} === 1`).assign(G, !0);
          return;
        case "null":
          E.elseIf((0, s._)`${C} === "" || ${C} === 0 || ${C} === false`), E.assign(G, null);
          return;
        case "array":
          E.elseIf((0, s._)`${W} === "string" || ${W} === "number"
              || ${W} === "boolean" || ${C} === null`).assign(G, (0, s._)`[${C}]`);
      }
    }
  }
  function b({ gen: S, parentData: I, parentDataProperty: D }, E) {
    S.if((0, s._)`${I} !== undefined`, () => S.assign((0, s._)`${I}[${D}]`, E));
  }
  function P(S, I, D, E = o.Correct) {
    const C = E === o.Correct ? s.operators.EQ : s.operators.NEQ;
    let A;
    switch (S) {
      case "null":
        return (0, s._)`${I} ${C} null`;
      case "array":
        A = (0, s._)`Array.isArray(${I})`;
        break;
      case "object":
        A = (0, s._)`${I} && typeof ${I} == "object" && !Array.isArray(${I})`;
        break;
      case "integer":
        A = W((0, s._)`!(${I} % 1) && !isNaN(${I})`);
        break;
      case "number":
        A = W();
        break;
      default:
        return (0, s._)`typeof ${I} ${C} ${S}`;
    }
    return E === o.Correct ? A : (0, s.not)(A);
    function W(G = s.nil) {
      return (0, s.and)((0, s._)`typeof ${I} == "number"`, G, D ? (0, s._)`isFinite(${I})` : s.nil);
    }
  }
  e.checkDataType = P;
  function O(S, I, D, E) {
    if (S.length === 1)
      return P(S[0], I, D, E);
    let C;
    const A = (0, i.toHash)(S);
    if (A.array && A.object) {
      const W = (0, s._)`typeof ${I} != "object"`;
      C = A.null ? W : (0, s._)`!${I} || ${W}`, delete A.null, delete A.array, delete A.object;
    } else
      C = s.nil;
    A.number && delete A.integer;
    for (const W in A)
      C = (0, s.and)(C, P(W, I, D, E));
    return C;
  }
  e.checkDataTypes = O;
  const w = {
    message: ({ schema: S }) => `must be ${S}`,
    params: ({ schema: S, schemaValue: I }) => typeof S == "string" ? (0, s._)`{type: ${S}}` : (0, s._)`{type: ${I}}`
  };
  function g(S) {
    const I = $(S);
    (0, n.reportError)(I, w);
  }
  e.reportTypeError = g;
  function $(S) {
    const { gen: I, data: D, schema: E } = S, C = (0, i.schemaRefOrVal)(S, E, "type");
    return {
      gen: I,
      keyword: "type",
      data: D,
      schema: E.type,
      schemaCode: C,
      schemaValue: C,
      parentSchema: E,
      params: {},
      it: S
    };
  }
})(Zt);
var Ar = {};
Object.defineProperty(Ar, "__esModule", { value: !0 });
Ar.assignDefaults = void 0;
const bt = B, Ia = X;
function ja(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const s in r)
      ws(e, s, r[s].default);
  else
    t === "array" && Array.isArray(n) && n.forEach((s, i) => ws(e, i, s.default));
}
Ar.assignDefaults = ja;
function ws(e, t, r) {
  const { gen: n, compositeRule: s, data: i, opts: o } = e;
  if (r === void 0)
    return;
  const u = (0, bt._)`${i}${(0, bt.getProperty)(t)}`;
  if (s) {
    (0, Ia.checkStrictMode)(e, `default is ignored for: ${u}`);
    return;
  }
  let f = (0, bt._)`${u} === undefined`;
  o.useDefaults === "empty" && (f = (0, bt._)`${f} || ${u} === null || ${u} === ""`), n.if(f, (0, bt._)`${u} = ${(0, bt.stringify)(r)}`);
}
var qe = {}, H = {};
Object.defineProperty(H, "__esModule", { value: !0 });
H.validateUnion = H.validateArray = H.usePattern = H.callValidateCode = H.schemaProperties = H.allSchemaProperties = H.noPropertyInData = H.propertyInData = H.isOwnProperty = H.hasPropFunc = H.reportMissingProp = H.checkMissingProp = H.checkReportMissingProp = void 0;
const re = B, hn = X, Je = We, Aa = X;
function Da(e, t) {
  const { gen: r, data: n, it: s } = e;
  r.if(yn(r, n, t, s.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, re._)`${t}` }, !0), e.error();
  });
}
H.checkReportMissingProp = Da;
function Ma({ gen: e, data: t, it: { opts: r } }, n, s) {
  return (0, re.or)(...n.map((i) => (0, re.and)(yn(e, t, i, r.ownProperties), (0, re._)`${s} = ${i}`)));
}
H.checkMissingProp = Ma;
function La(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
H.reportMissingProp = La;
function mi(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, re._)`Object.prototype.hasOwnProperty`
  });
}
H.hasPropFunc = mi;
function mn(e, t, r) {
  return (0, re._)`${mi(e)}.call(${t}, ${r})`;
}
H.isOwnProperty = mn;
function Fa(e, t, r, n) {
  const s = (0, re._)`${t}${(0, re.getProperty)(r)} !== undefined`;
  return n ? (0, re._)`${s} && ${mn(e, t, r)}` : s;
}
H.propertyInData = Fa;
function yn(e, t, r, n) {
  const s = (0, re._)`${t}${(0, re.getProperty)(r)} === undefined`;
  return n ? (0, re.or)(s, (0, re.not)(mn(e, t, r))) : s;
}
H.noPropertyInData = yn;
function yi(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
H.allSchemaProperties = yi;
function qa(e, t) {
  return yi(t).filter((r) => !(0, hn.alwaysValidSchema)(e, t[r]));
}
H.schemaProperties = qa;
function Ua({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: i }, it: o }, u, f, l) {
  const d = l ? (0, re._)`${e}, ${t}, ${n}${s}` : t, p = [
    [Je.default.instancePath, (0, re.strConcat)(Je.default.instancePath, i)],
    [Je.default.parentData, o.parentData],
    [Je.default.parentDataProperty, o.parentDataProperty],
    [Je.default.rootData, Je.default.rootData]
  ];
  o.opts.dynamicRef && p.push([Je.default.dynamicAnchors, Je.default.dynamicAnchors]);
  const _ = (0, re._)`${d}, ${r.object(...p)}`;
  return f !== re.nil ? (0, re._)`${u}.call(${f}, ${_})` : (0, re._)`${u}(${_})`;
}
H.callValidateCode = Ua;
const za = (0, re._)`new RegExp`;
function Va({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: s } = t.code, i = s(r, n);
  return e.scopeValue("pattern", {
    key: i.toString(),
    ref: i,
    code: (0, re._)`${s.code === "new RegExp" ? za : (0, Aa.useFunc)(e, s)}(${r}, ${n})`
  });
}
H.usePattern = Va;
function Wa(e) {
  const { gen: t, data: r, keyword: n, it: s } = e, i = t.name("valid");
  if (s.allErrors) {
    const u = t.let("valid", !0);
    return o(() => t.assign(u, !1)), u;
  }
  return t.var(i, !0), o(() => t.break()), i;
  function o(u) {
    const f = t.const("len", (0, re._)`${r}.length`);
    t.forRange("i", 0, f, (l) => {
      e.subschema({
        keyword: n,
        dataProp: l,
        dataPropType: hn.Type.Num
      }, i), t.if((0, re.not)(i), u);
    });
  }
}
H.validateArray = Wa;
function xa(e) {
  const { gen: t, schema: r, keyword: n, it: s } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((f) => (0, hn.alwaysValidSchema)(s, f)) && !s.opts.unevaluated)
    return;
  const o = t.let("valid", !1), u = t.name("_valid");
  t.block(() => r.forEach((f, l) => {
    const d = e.subschema({
      keyword: n,
      schemaProp: l,
      compositeRule: !0
    }, u);
    t.assign(o, (0, re._)`${o} || ${u}`), e.mergeValidEvaluated(d, u) || t.if((0, re.not)(o));
  })), e.result(o, () => e.reset(), () => e.error(!0));
}
H.validateUnion = xa;
Object.defineProperty(qe, "__esModule", { value: !0 });
qe.validateKeywordUsage = qe.validSchemaType = qe.funcKeywordCode = qe.macroKeywordCode = void 0;
const $e = B, ot = We, Ha = H, Ba = Yt;
function Ga(e, t) {
  const { gen: r, keyword: n, schema: s, parentSchema: i, it: o } = e, u = t.macro.call(o.self, s, i, o), f = gi(r, n, u);
  o.opts.validateSchema !== !1 && o.self.validateSchema(u, !0);
  const l = r.name("valid");
  e.subschema({
    schema: u,
    schemaPath: $e.nil,
    errSchemaPath: `${o.errSchemaPath}/${n}`,
    topSchemaRef: f,
    compositeRule: !0
  }, l), e.pass(l, () => e.error(!0));
}
qe.macroKeywordCode = Ga;
function Ka(e, t) {
  var r;
  const { gen: n, keyword: s, schema: i, parentSchema: o, $data: u, it: f } = e;
  Qa(f, t);
  const l = !u && t.compile ? t.compile.call(f.self, i, o, f) : t.validate, d = gi(n, s, l), p = n.let("valid");
  e.block$data(p, _), e.ok((r = t.valid) !== null && r !== void 0 ? r : p);
  function _() {
    if (t.errors === !1)
      O(), t.modifying && vs(e), w(() => e.error());
    else {
      const g = t.async ? b() : P();
      t.modifying && vs(e), w(() => Ja(e, g));
    }
  }
  function b() {
    const g = n.let("ruleErrs", null);
    return n.try(() => O((0, $e._)`await `), ($) => n.assign(p, !1).if((0, $e._)`${$} instanceof ${f.ValidationError}`, () => n.assign(g, (0, $e._)`${$}.errors`), () => n.throw($))), g;
  }
  function P() {
    const g = (0, $e._)`${d}.errors`;
    return n.assign(g, null), O($e.nil), g;
  }
  function O(g = t.async ? (0, $e._)`await ` : $e.nil) {
    const $ = f.opts.passContext ? ot.default.this : ot.default.self, S = !("compile" in t && !u || t.schema === !1);
    n.assign(p, (0, $e._)`${g}${(0, Ha.callValidateCode)(e, d, $, S)}`, t.modifying);
  }
  function w(g) {
    var $;
    n.if((0, $e.not)(($ = t.valid) !== null && $ !== void 0 ? $ : p), g);
  }
}
qe.funcKeywordCode = Ka;
function vs(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, $e._)`${n.parentData}[${n.parentDataProperty}]`));
}
function Ja(e, t) {
  const { gen: r } = e;
  r.if((0, $e._)`Array.isArray(${t})`, () => {
    r.assign(ot.default.vErrors, (0, $e._)`${ot.default.vErrors} === null ? ${t} : ${ot.default.vErrors}.concat(${t})`).assign(ot.default.errors, (0, $e._)`${ot.default.vErrors}.length`), (0, Ba.extendErrors)(e);
  }, () => e.error());
}
function Qa({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function gi(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, $e.stringify)(r) });
}
function Ya(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
qe.validSchemaType = Ya;
function Za({ schema: e, opts: t, self: r, errSchemaPath: n }, s, i) {
  if (Array.isArray(s.keyword) ? !s.keyword.includes(i) : s.keyword !== i)
    throw new Error("ajv implementation error");
  const o = s.dependencies;
  if (o != null && o.some((u) => !Object.prototype.hasOwnProperty.call(e, u)))
    throw new Error(`parent schema must have dependencies of ${i}: ${o.join(",")}`);
  if (s.validateSchema && !s.validateSchema(e[i])) {
    const f = `keyword "${i}" value is invalid at path "${n}": ` + r.errorsText(s.validateSchema.errors);
    if (t.validateSchema === "log")
      r.logger.error(f);
    else
      throw new Error(f);
  }
}
qe.validateKeywordUsage = Za;
var Ze = {};
Object.defineProperty(Ze, "__esModule", { value: !0 });
Ze.extendSubschemaMode = Ze.extendSubschemaData = Ze.getSubschema = void 0;
const Fe = B, $i = X;
function Xa(e, { keyword: t, schemaProp: r, schema: n, schemaPath: s, errSchemaPath: i, topSchemaRef: o }) {
  if (t !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (t !== void 0) {
    const u = e.schema[t];
    return r === void 0 ? {
      schema: u,
      schemaPath: (0, Fe._)`${e.schemaPath}${(0, Fe.getProperty)(t)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}`
    } : {
      schema: u[r],
      schemaPath: (0, Fe._)`${e.schemaPath}${(0, Fe.getProperty)(t)}${(0, Fe.getProperty)(r)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, $i.escapeFragment)(r)}`
    };
  }
  if (n !== void 0) {
    if (s === void 0 || i === void 0 || o === void 0)
      throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
    return {
      schema: n,
      schemaPath: s,
      topSchemaRef: o,
      errSchemaPath: i
    };
  }
  throw new Error('either "keyword" or "schema" must be passed');
}
Ze.getSubschema = Xa;
function ec(e, t, { dataProp: r, dataPropType: n, data: s, dataTypes: i, propertyName: o }) {
  if (s !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: u } = t;
  if (r !== void 0) {
    const { errorPath: l, dataPathArr: d, opts: p } = t, _ = u.let("data", (0, Fe._)`${t.data}${(0, Fe.getProperty)(r)}`, !0);
    f(_), e.errorPath = (0, Fe.str)`${l}${(0, $i.getErrorPath)(r, n, p.jsPropertySyntax)}`, e.parentDataProperty = (0, Fe._)`${r}`, e.dataPathArr = [...d, e.parentDataProperty];
  }
  if (s !== void 0) {
    const l = s instanceof Fe.Name ? s : u.let("data", s, !0);
    f(l), o !== void 0 && (e.propertyName = o);
  }
  i && (e.dataTypes = i);
  function f(l) {
    e.data = l, e.dataLevel = t.dataLevel + 1, e.dataTypes = [], t.definedProperties = /* @__PURE__ */ new Set(), e.parentData = t.data, e.dataNames = [...t.dataNames, l];
  }
}
Ze.extendSubschemaData = ec;
function tc(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: s, allErrors: i }) {
  n !== void 0 && (e.compositeRule = n), s !== void 0 && (e.createErrors = s), i !== void 0 && (e.allErrors = i), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
Ze.extendSubschemaMode = tc;
var ye = {}, _i = function e(t, r) {
  if (t === r)
    return !0;
  if (t && r && typeof t == "object" && typeof r == "object") {
    if (t.constructor !== r.constructor)
      return !1;
    var n, s, i;
    if (Array.isArray(t)) {
      if (n = t.length, n != r.length)
        return !1;
      for (s = n; s-- !== 0; )
        if (!e(t[s], r[s]))
          return !1;
      return !0;
    }
    if (t.constructor === RegExp)
      return t.source === r.source && t.flags === r.flags;
    if (t.valueOf !== Object.prototype.valueOf)
      return t.valueOf() === r.valueOf();
    if (t.toString !== Object.prototype.toString)
      return t.toString() === r.toString();
    if (i = Object.keys(t), n = i.length, n !== Object.keys(r).length)
      return !1;
    for (s = n; s-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(r, i[s]))
        return !1;
    for (s = n; s-- !== 0; ) {
      var o = i[s];
      if (!e(t[o], r[o]))
        return !1;
    }
    return !0;
  }
  return t !== t && r !== r;
}, wi = { exports: {} }, Ye = wi.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  hr(t, n, s, e, "", e);
};
Ye.keywords = {
  additionalItems: !0,
  items: !0,
  contains: !0,
  additionalProperties: !0,
  propertyNames: !0,
  not: !0,
  if: !0,
  then: !0,
  else: !0
};
Ye.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
Ye.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
Ye.skipKeywords = {
  default: !0,
  enum: !0,
  const: !0,
  required: !0,
  maximum: !0,
  minimum: !0,
  exclusiveMaximum: !0,
  exclusiveMinimum: !0,
  multipleOf: !0,
  maxLength: !0,
  minLength: !0,
  pattern: !0,
  format: !0,
  maxItems: !0,
  minItems: !0,
  uniqueItems: !0,
  maxProperties: !0,
  minProperties: !0
};
function hr(e, t, r, n, s, i, o, u, f, l) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, s, i, o, u, f, l);
    for (var d in n) {
      var p = n[d];
      if (Array.isArray(p)) {
        if (d in Ye.arrayKeywords)
          for (var _ = 0; _ < p.length; _++)
            hr(e, t, r, p[_], s + "/" + d + "/" + _, i, s, d, n, _);
      } else if (d in Ye.propsKeywords) {
        if (p && typeof p == "object")
          for (var b in p)
            hr(e, t, r, p[b], s + "/" + d + "/" + rc(b), i, s, d, n, b);
      } else
        (d in Ye.keywords || e.allKeys && !(d in Ye.skipKeywords)) && hr(e, t, r, p, s + "/" + d, i, s, d, n);
    }
    r(n, s, i, o, u, f, l);
  }
}
function rc(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var nc = wi.exports;
Object.defineProperty(ye, "__esModule", { value: !0 });
ye.getSchemaRefs = ye.resolveUrl = ye.normalizeId = ye._getFullPath = ye.getFullPath = ye.inlineRef = void 0;
const sc = X, ic = _i, oc = nc, ac = /* @__PURE__ */ new Set([
  "type",
  "format",
  "pattern",
  "maxLength",
  "minLength",
  "maxProperties",
  "minProperties",
  "maxItems",
  "minItems",
  "maximum",
  "minimum",
  "uniqueItems",
  "multipleOf",
  "required",
  "enum",
  "const"
]);
function cc(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !nn(e) : t ? vi(e) <= t : !1;
}
ye.inlineRef = cc;
const lc = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function nn(e) {
  for (const t in e) {
    if (lc.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(nn) || typeof r == "object" && nn(r))
      return !0;
  }
  return !1;
}
function vi(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !ac.has(r) && (typeof e[r] == "object" && (0, sc.eachItem)(e[r], (n) => t += vi(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function bi(e, t = "", r) {
  r !== !1 && (t = Rt(t));
  const n = e.parse(t);
  return Ei(e, n);
}
ye.getFullPath = bi;
function Ei(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
ye._getFullPath = Ei;
const uc = /#\/?$/;
function Rt(e) {
  return e ? e.replace(uc, "") : "";
}
ye.normalizeId = Rt;
function dc(e, t, r) {
  return r = Rt(r), e.resolve(t, r);
}
ye.resolveUrl = dc;
const fc = /^[a-z_][-a-z0-9._]*$/i;
function pc(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = Rt(e[r] || t), i = { "": s }, o = bi(n, s, !1), u = {}, f = /* @__PURE__ */ new Set();
  return oc(e, { allKeys: !0 }, (p, _, b, P) => {
    if (P === void 0)
      return;
    const O = o + _;
    let w = i[P];
    typeof p[r] == "string" && (w = g.call(this, p[r])), $.call(this, p.$anchor), $.call(this, p.$dynamicAnchor), i[_] = w;
    function g(S) {
      const I = this.opts.uriResolver.resolve;
      if (S = Rt(w ? I(w, S) : S), f.has(S))
        throw d(S);
      f.add(S);
      let D = this.refs[S];
      return typeof D == "string" && (D = this.refs[D]), typeof D == "object" ? l(p, D.schema, S) : S !== Rt(O) && (S[0] === "#" ? (l(p, u[S], S), u[S] = p) : this.refs[S] = O), S;
    }
    function $(S) {
      if (typeof S == "string") {
        if (!fc.test(S))
          throw new Error(`invalid anchor "${S}"`);
        g.call(this, `#${S}`);
      }
    }
  }), u;
  function l(p, _, b) {
    if (_ !== void 0 && !ic(p, _))
      throw d(b);
  }
  function d(p) {
    return new Error(`reference "${p}" resolves to more than one schema`);
  }
}
ye.getSchemaRefs = pc;
Object.defineProperty(Ne, "__esModule", { value: !0 });
Ne.getData = Ne.KeywordCxt = Ne.validateFunctionCode = void 0;
const Pi = kt, bs = Zt, gn = Be, Er = Zt, hc = Ar, Ht = qe, Wr = Ze, q = B, V = We, mc = ye, Ge = X, Vt = Yt;
function yc(e) {
  if (Ri(e) && (ki(e), Ti(e))) {
    _c(e);
    return;
  }
  Si(e, () => (0, Pi.topBoolOrEmptySchema)(e));
}
Ne.validateFunctionCode = yc;
function Si({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: s }, i) {
  s.code.es5 ? e.func(t, (0, q._)`${V.default.data}, ${V.default.valCxt}`, n.$async, () => {
    e.code((0, q._)`"use strict"; ${Es(r, s)}`), $c(e, s), e.code(i);
  }) : e.func(t, (0, q._)`${V.default.data}, ${gc(s)}`, n.$async, () => e.code(Es(r, s)).code(i));
}
function gc(e) {
  return (0, q._)`{${V.default.instancePath}="", ${V.default.parentData}, ${V.default.parentDataProperty}, ${V.default.rootData}=${V.default.data}${e.dynamicRef ? (0, q._)`, ${V.default.dynamicAnchors}={}` : q.nil}}={}`;
}
function $c(e, t) {
  e.if(V.default.valCxt, () => {
    e.var(V.default.instancePath, (0, q._)`${V.default.valCxt}.${V.default.instancePath}`), e.var(V.default.parentData, (0, q._)`${V.default.valCxt}.${V.default.parentData}`), e.var(V.default.parentDataProperty, (0, q._)`${V.default.valCxt}.${V.default.parentDataProperty}`), e.var(V.default.rootData, (0, q._)`${V.default.valCxt}.${V.default.rootData}`), t.dynamicRef && e.var(V.default.dynamicAnchors, (0, q._)`${V.default.valCxt}.${V.default.dynamicAnchors}`);
  }, () => {
    e.var(V.default.instancePath, (0, q._)`""`), e.var(V.default.parentData, (0, q._)`undefined`), e.var(V.default.parentDataProperty, (0, q._)`undefined`), e.var(V.default.rootData, V.default.data), t.dynamicRef && e.var(V.default.dynamicAnchors, (0, q._)`{}`);
  });
}
function _c(e) {
  const { schema: t, opts: r, gen: n } = e;
  Si(e, () => {
    r.$comment && t.$comment && Ci(e), Pc(e), n.let(V.default.vErrors, null), n.let(V.default.errors, 0), r.unevaluated && wc(e), Oi(e), Rc(e);
  });
}
function wc(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, q._)`${r}.evaluated`), t.if((0, q._)`${e.evaluated}.dynamicProps`, () => t.assign((0, q._)`${e.evaluated}.props`, (0, q._)`undefined`)), t.if((0, q._)`${e.evaluated}.dynamicItems`, () => t.assign((0, q._)`${e.evaluated}.items`, (0, q._)`undefined`));
}
function Es(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, q._)`/*# sourceURL=${r} */` : q.nil;
}
function vc(e, t) {
  if (Ri(e) && (ki(e), Ti(e))) {
    bc(e, t);
    return;
  }
  (0, Pi.boolOrEmptySchema)(e, t);
}
function Ti({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t.RULES.all[r])
      return !0;
  return !1;
}
function Ri(e) {
  return typeof e.schema != "boolean";
}
function bc(e, t) {
  const { schema: r, gen: n, opts: s } = e;
  s.$comment && r.$comment && Ci(e), Sc(e), Tc(e);
  const i = n.const("_errs", V.default.errors);
  Oi(e, i), n.var(t, (0, q._)`${i} === ${V.default.errors}`);
}
function ki(e) {
  (0, Ge.checkUnknownRules)(e), Ec(e);
}
function Oi(e, t) {
  if (e.opts.jtd)
    return Ps(e, [], !1, t);
  const r = (0, bs.getSchemaTypes)(e.schema), n = (0, bs.coerceAndCheckDataType)(e, r);
  Ps(e, r, !n, t);
}
function Ec(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: s } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, Ge.schemaHasRulesButRef)(t, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function Pc(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, Ge.checkStrictMode)(e, "default is ignored in the schema root");
}
function Sc(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, mc.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function Tc(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function Ci({ gen: e, schemaEnv: t, schema: r, errSchemaPath: n, opts: s }) {
  const i = r.$comment;
  if (s.$comment === !0)
    e.code((0, q._)`${V.default.self}.logger.log(${i})`);
  else if (typeof s.$comment == "function") {
    const o = (0, q.str)`${n}/$comment`, u = e.scopeValue("root", { ref: t.root });
    e.code((0, q._)`${V.default.self}.opts.$comment(${i}, ${o}, ${u}.schema)`);
  }
}
function Rc(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: s, opts: i } = e;
  r.$async ? t.if((0, q._)`${V.default.errors} === 0`, () => t.return(V.default.data), () => t.throw((0, q._)`new ${s}(${V.default.vErrors})`)) : (t.assign((0, q._)`${n}.errors`, V.default.vErrors), i.unevaluated && kc(e), t.return((0, q._)`${V.default.errors} === 0`));
}
function kc({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof q.Name && e.assign((0, q._)`${t}.props`, r), n instanceof q.Name && e.assign((0, q._)`${t}.items`, n);
}
function Ps(e, t, r, n) {
  const { gen: s, schema: i, data: o, allErrors: u, opts: f, self: l } = e, { RULES: d } = l;
  if (i.$ref && (f.ignoreKeywordsWithRef || !(0, Ge.schemaHasRulesButRef)(i, d))) {
    s.block(() => ji(e, "$ref", d.all.$ref.definition));
    return;
  }
  f.jtd || Oc(e, t), s.block(() => {
    for (const _ of d.rules)
      p(_);
    p(d.post);
  });
  function p(_) {
    (0, gn.shouldUseGroup)(i, _) && (_.type ? (s.if((0, Er.checkDataType)(_.type, o, f.strictNumbers)), Ss(e, _), t.length === 1 && t[0] === _.type && r && (s.else(), (0, Er.reportTypeError)(e)), s.endIf()) : Ss(e, _), u || s.if((0, q._)`${V.default.errors} === ${n || 0}`));
  }
}
function Ss(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: s } } = e;
  s && (0, hc.assignDefaults)(e, t.type), r.block(() => {
    for (const i of t.rules)
      (0, gn.shouldUseRule)(n, i) && ji(e, i.keyword, i.definition, t.type);
  });
}
function Oc(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (Cc(e, t), e.opts.allowUnionTypes || Nc(e, t), Ic(e, e.dataTypes));
}
function Cc(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      Ni(e.dataTypes, r) || $n(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), Ac(e, t);
  }
}
function Nc(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && $n(e, "use allowUnionTypes to allow union type keyword");
}
function Ic(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const s = r[n];
    if (typeof s == "object" && (0, gn.shouldUseRule)(e.schema, s)) {
      const { type: i } = s.definition;
      i.length && !i.some((o) => jc(t, o)) && $n(e, `missing type "${i.join(",")}" for keyword "${n}"`);
    }
  }
}
function jc(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function Ni(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function Ac(e, t) {
  const r = [];
  for (const n of e.dataTypes)
    Ni(t, n) ? r.push(n) : t.includes("integer") && n === "number" && r.push("integer");
  e.dataTypes = r;
}
function $n(e, t) {
  const r = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${r}" (strictTypes)`, (0, Ge.checkStrictMode)(e, t, e.opts.strictTypes);
}
class Ii {
  constructor(t, r, n) {
    if ((0, Ht.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, Ge.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", Ai(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, Ht.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
      throw new Error(`${n} value must be ${JSON.stringify(r.schemaType)}`);
    ("code" in r ? r.trackErrors : r.errors !== !1) && (this.errsCount = t.gen.const("_errs", V.default.errors));
  }
  result(t, r, n) {
    this.failResult((0, q.not)(t), r, n);
  }
  failResult(t, r, n) {
    this.gen.if(t), n ? n() : this.error(), r ? (this.gen.else(), r(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  pass(t, r) {
    this.failResult((0, q.not)(t), void 0, r);
  }
  fail(t) {
    if (t === void 0) {
      this.error(), this.allErrors || this.gen.if(!1);
      return;
    }
    this.gen.if(t), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  fail$data(t) {
    if (!this.$data)
      return this.fail(t);
    const { schemaCode: r } = this;
    this.fail((0, q._)`${r} !== undefined && (${(0, q.or)(this.invalid$data(), t)})`);
  }
  error(t, r, n) {
    if (r) {
      this.setParams(r), this._error(t, n), this.setParams({});
      return;
    }
    this._error(t, n);
  }
  _error(t, r) {
    (t ? Vt.reportExtraError : Vt.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, Vt.reportError)(this, this.def.$dataError || Vt.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, Vt.resetErrorsCount)(this.gen, this.errsCount);
  }
  ok(t) {
    this.allErrors || this.gen.if(t);
  }
  setParams(t, r) {
    r ? Object.assign(this.params, t) : this.params = t;
  }
  block$data(t, r, n = q.nil) {
    this.gen.block(() => {
      this.check$data(t, n), r();
    });
  }
  check$data(t = q.nil, r = q.nil) {
    if (!this.$data)
      return;
    const { gen: n, schemaCode: s, schemaType: i, def: o } = this;
    n.if((0, q.or)((0, q._)`${s} === undefined`, r)), t !== q.nil && n.assign(t, !0), (i.length || o.validateSchema) && (n.elseIf(this.invalid$data()), this.$dataError(), t !== q.nil && n.assign(t, !1)), n.else();
  }
  invalid$data() {
    const { gen: t, schemaCode: r, schemaType: n, def: s, it: i } = this;
    return (0, q.or)(o(), u());
    function o() {
      if (n.length) {
        if (!(r instanceof q.Name))
          throw new Error("ajv implementation error");
        const f = Array.isArray(n) ? n : [n];
        return (0, q._)`${(0, Er.checkDataTypes)(f, r, i.opts.strictNumbers, Er.DataType.Wrong)}`;
      }
      return q.nil;
    }
    function u() {
      if (s.validateSchema) {
        const f = t.scopeValue("validate$data", { ref: s.validateSchema });
        return (0, q._)`!${f}(${r})`;
      }
      return q.nil;
    }
  }
  subschema(t, r) {
    const n = (0, Wr.getSubschema)(this.it, t);
    (0, Wr.extendSubschemaData)(n, this.it, t), (0, Wr.extendSubschemaMode)(n, t);
    const s = { ...this.it, ...n, items: void 0, props: void 0 };
    return vc(s, r), s;
  }
  mergeEvaluated(t, r) {
    const { it: n, gen: s } = this;
    n.opts.unevaluated && (n.props !== !0 && t.props !== void 0 && (n.props = Ge.mergeEvaluated.props(s, t.props, n.props, r)), n.items !== !0 && t.items !== void 0 && (n.items = Ge.mergeEvaluated.items(s, t.items, n.items, r)));
  }
  mergeValidEvaluated(t, r) {
    const { it: n, gen: s } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return s.if(r, () => this.mergeEvaluated(t, q.Name)), !0;
  }
}
Ne.KeywordCxt = Ii;
function ji(e, t, r, n) {
  const s = new Ii(e, r, t);
  "code" in r ? r.code(s, n) : s.$data && r.validate ? (0, Ht.funcKeywordCode)(s, r) : "macro" in r ? (0, Ht.macroKeywordCode)(s, r) : (r.compile || r.validate) && (0, Ht.funcKeywordCode)(s, r);
}
const Dc = /^\/(?:[^~]|~0|~1)*$/, Mc = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function Ai(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let s, i;
  if (e === "")
    return V.default.rootData;
  if (e[0] === "/") {
    if (!Dc.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    s = e, i = V.default.rootData;
  } else {
    const l = Mc.exec(e);
    if (!l)
      throw new Error(`Invalid JSON-pointer: ${e}`);
    const d = +l[1];
    if (s = l[2], s === "#") {
      if (d >= t)
        throw new Error(f("property/index", d));
      return n[t - d];
    }
    if (d > t)
      throw new Error(f("data", d));
    if (i = r[t - d], !s)
      return i;
  }
  let o = i;
  const u = s.split("/");
  for (const l of u)
    l && (i = (0, q._)`${i}${(0, q.getProperty)((0, Ge.unescapeJsonPointer)(l))}`, o = (0, q._)`${o} && ${i}`);
  return o;
  function f(l, d) {
    return `Cannot access ${l} ${d} levels up, current level is ${t}`;
  }
}
Ne.getData = Ai;
var Xt = {};
Object.defineProperty(Xt, "__esModule", { value: !0 });
class Lc extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
}
Xt.default = Lc;
var er = {};
Object.defineProperty(er, "__esModule", { value: !0 });
const xr = ye;
class Fc extends Error {
  constructor(t, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, xr.resolveUrl)(t, r, n), this.missingSchema = (0, xr.normalizeId)((0, xr.getFullPath)(t, this.missingRef));
  }
}
er.default = Fc;
var ve = {};
Object.defineProperty(ve, "__esModule", { value: !0 });
ve.resolveSchema = ve.getCompilingSchema = ve.resolveRef = ve.compileSchema = ve.SchemaEnv = void 0;
const ke = B, qc = Xt, it = We, Ce = ye, Ts = X, Uc = Ne;
class Dr {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, Ce.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
}
ve.SchemaEnv = Dr;
function _n(e) {
  const t = Di.call(this, e);
  if (t)
    return t;
  const r = (0, Ce.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: i } = this.opts, o = new ke.CodeGen(this.scope, { es5: n, lines: s, ownProperties: i });
  let u;
  e.$async && (u = o.scopeValue("Error", {
    ref: qc.default,
    code: (0, ke._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const f = o.scopeName("validate");
  e.validateName = f;
  const l = {
    gen: o,
    allErrors: this.opts.allErrors,
    data: it.default.data,
    parentData: it.default.parentData,
    parentDataProperty: it.default.parentDataProperty,
    dataNames: [it.default.data],
    dataPathArr: [ke.nil],
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: o.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, ke.stringify)(e.schema) } : { ref: e.schema }),
    validateName: f,
    ValidationError: u,
    schema: e.schema,
    schemaEnv: e,
    rootId: r,
    baseId: e.baseId || r,
    schemaPath: ke.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, ke._)`""`,
    opts: this.opts,
    self: this
  };
  let d;
  try {
    this._compilations.add(e), (0, Uc.validateFunctionCode)(l), o.optimize(this.opts.code.optimize);
    const p = o.toString();
    d = `${o.scopeRefs(it.default.scope)}return ${p}`, this.opts.code.process && (d = this.opts.code.process(d, e));
    // const b = new Function(`${it.default.self}`, `${it.default.scope}`, d)(this, this.scope.get());
    const b = function() { return true };
    if (this.scope.value(f, { ref: b }), b.errors = null, b.schema = e.schema, b.schemaEnv = e, e.$async && (b.$async = !0), this.opts.code.source === !0 && (b.source = { validateName: f, validateCode: p, scopeValues: o._values }), this.opts.unevaluated) {
      const { props: P, items: O } = l;
      b.evaluated = {
        props: P instanceof ke.Name ? void 0 : P,
        items: O instanceof ke.Name ? void 0 : O,
        dynamicProps: P instanceof ke.Name,
        dynamicItems: O instanceof ke.Name
      }, b.source && (b.source.evaluated = (0, ke.stringify)(b.evaluated));
    }
    return e.validate = b, e;
  } catch (p) {
    throw delete e.validate, delete e.validateName, d && this.logger.error("Error compiling schema, function code:", d), p;
  } finally {
    this._compilations.delete(e);
  }
}
ve.compileSchema = _n;
function zc(e, t, r) {
  var n;
  r = (0, Ce.resolveUrl)(this.opts.uriResolver, t, r);
  const s = e.refs[r];
  if (s)
    return s;
  let i = xc.call(this, e, r);
  if (i === void 0) {
    const o = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: u } = this.opts;
    o && (i = new Dr({ schema: o, schemaId: u, root: e, baseId: t }));
  }
  if (i !== void 0)
    return e.refs[r] = Vc.call(this, i);
}
ve.resolveRef = zc;
function Vc(e) {
  return (0, Ce.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : _n.call(this, e);
}
function Di(e) {
  for (const t of this._compilations)
    if (Wc(t, e))
      return t;
}
ve.getCompilingSchema = Di;
function Wc(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function xc(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || Mr.call(this, e, t);
}
function Mr(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, Ce._getFullPath)(this.opts.uriResolver, r);
  let s = (0, Ce.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === s)
    return Hr.call(this, r, e);
  const i = (0, Ce.normalizeId)(n), o = this.refs[i] || this.schemas[i];
  if (typeof o == "string") {
    const u = Mr.call(this, e, o);
    return typeof (u == null ? void 0 : u.schema) != "object" ? void 0 : Hr.call(this, r, u);
  }
  if (typeof (o == null ? void 0 : o.schema) == "object") {
    if (o.validate || _n.call(this, o), i === (0, Ce.normalizeId)(t)) {
      const { schema: u } = o, { schemaId: f } = this.opts, l = u[f];
      return l && (s = (0, Ce.resolveUrl)(this.opts.uriResolver, s, l)), new Dr({ schema: u, schemaId: f, root: e, baseId: s });
    }
    return Hr.call(this, r, o);
  }
}
ve.resolveSchema = Mr;
const Hc = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function Hr(e, { baseId: t, schema: r, root: n }) {
  var s;
  if (((s = e.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const u of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const f = r[(0, Ts.unescapeFragment)(u)];
    if (f === void 0)
      return;
    r = f;
    const l = typeof r == "object" && r[this.opts.schemaId];
    !Hc.has(u) && l && (t = (0, Ce.resolveUrl)(this.opts.uriResolver, t, l));
  }
  let i;
  if (typeof r != "boolean" && r.$ref && !(0, Ts.schemaHasRulesButRef)(r, this.RULES)) {
    const u = (0, Ce.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    i = Mr.call(this, n, u);
  }
  const { schemaId: o } = this.opts;
  if (i = i || new Dr({ schema: r, schemaId: o, root: n, baseId: t }), i.schema !== i.root.schema)
    return i;
}
const Bc = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", Gc = "Meta-schema for $data reference (JSON AnySchema extension proposal)", Kc = "object", Jc = [
  "$data"
], Qc = {
  $data: {
    type: "string",
    anyOf: [
      {
        format: "relative-json-pointer"
      },
      {
        format: "json-pointer"
      }
    ]
  }
}, Yc = !1, Zc = {
  $id: Bc,
  description: Gc,
  type: Kc,
  required: Jc,
  properties: Qc,
  additionalProperties: Yc
};
var wn = {}, sn = { exports: {} };
/** @license URI.js v4.4.1 (c) 2011 Gary Court. License: http://github.com/garycourt/uri-js */
(function(e, t) {
  (function(r, n) {
    n(t);
  })(aa, function(r) {
    function n() {
      for (var h = arguments.length, c = Array(h), y = 0; y < h; y++)
        c[y] = arguments[y];
      if (c.length > 1) {
        c[0] = c[0].slice(0, -1);
        for (var k = c.length - 1, R = 1; R < k; ++R)
          c[R] = c[R].slice(1, -1);
        return c[k] = c[k].slice(1), c.join("");
      } else
        return c[0];
    }
    function s(h) {
      return "(?:" + h + ")";
    }
    function i(h) {
      return h === void 0 ? "undefined" : h === null ? "null" : Object.prototype.toString.call(h).split(" ").pop().split("]").shift().toLowerCase();
    }
    function o(h) {
      return h.toUpperCase();
    }
    function u(h) {
      return h != null ? h instanceof Array ? h : typeof h.length != "number" || h.split || h.setInterval || h.call ? [h] : Array.prototype.slice.call(h) : [];
    }
    function f(h, c) {
      var y = h;
      if (c)
        for (var k in c)
          y[k] = c[k];
      return y;
    }
    function l(h) {
      var c = "[A-Za-z]", y = "[0-9]", k = n(y, "[A-Fa-f]"), R = s(s("%[EFef]" + k + "%" + k + k + "%" + k + k) + "|" + s("%[89A-Fa-f]" + k + "%" + k + k) + "|" + s("%" + k + k)), U = "[\\:\\/\\?\\#\\[\\]\\@]", z = "[\\!\\$\\&\\'\\(\\)\\*\\+\\,\\;\\=]", Z = n(U, z), te = h ? "[\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]" : "[]", ae = h ? "[\\uE000-\\uF8FF]" : "[]", J = n(c, y, "[\\-\\.\\_\\~]", te);
      s(c + n(c, y, "[\\+\\-\\.]") + "*"), s(s(R + "|" + n(J, z, "[\\:]")) + "*");
      var ee = s(s("25[0-5]") + "|" + s("2[0-4]" + y) + "|" + s("1" + y + y) + "|" + s("0?[1-9]" + y) + "|0?0?" + y), ce = s(ee + "\\." + ee + "\\." + ee + "\\." + ee), x = s(k + "{1,4}"), ne = s(s(x + "\\:" + x) + "|" + ce), pe = s(s(x + "\\:") + "{6}" + ne), se = s("\\:\\:" + s(x + "\\:") + "{5}" + ne), Ke = s(s(x) + "?\\:\\:" + s(x + "\\:") + "{4}" + ne), De = s(s(s(x + "\\:") + "{0,1}" + x) + "?\\:\\:" + s(x + "\\:") + "{3}" + ne), Me = s(s(s(x + "\\:") + "{0,2}" + x) + "?\\:\\:" + s(x + "\\:") + "{2}" + ne), vt = s(s(s(x + "\\:") + "{0,3}" + x) + "?\\:\\:" + x + "\\:" + ne), nt = s(s(s(x + "\\:") + "{0,4}" + x) + "?\\:\\:" + ne), Te = s(s(s(x + "\\:") + "{0,5}" + x) + "?\\:\\:" + x), Le = s(s(s(x + "\\:") + "{0,6}" + x) + "?\\:\\:"), st = s([pe, se, Ke, De, Me, vt, nt, Te, Le].join("|")), xe = s(s(J + "|" + R) + "+");
      s("[vV]" + k + "+\\." + n(J, z, "[\\:]") + "+"), s(s(R + "|" + n(J, z)) + "*");
      var Ut = s(R + "|" + n(J, z, "[\\:\\@]"));
      return s(s(R + "|" + n(J, z, "[\\@]")) + "+"), s(s(Ut + "|" + n("[\\/\\?]", ae)) + "*"), {
        NOT_SCHEME: new RegExp(n("[^]", c, y, "[\\+\\-\\.]"), "g"),
        NOT_USERINFO: new RegExp(n("[^\\%\\:]", J, z), "g"),
        NOT_HOST: new RegExp(n("[^\\%\\[\\]\\:]", J, z), "g"),
        NOT_PATH: new RegExp(n("[^\\%\\/\\:\\@]", J, z), "g"),
        NOT_PATH_NOSCHEME: new RegExp(n("[^\\%\\/\\@]", J, z), "g"),
        NOT_QUERY: new RegExp(n("[^\\%]", J, z, "[\\:\\@\\/\\?]", ae), "g"),
        NOT_FRAGMENT: new RegExp(n("[^\\%]", J, z, "[\\:\\@\\/\\?]"), "g"),
        ESCAPE: new RegExp(n("[^]", J, z), "g"),
        UNRESERVED: new RegExp(J, "g"),
        OTHER_CHARS: new RegExp(n("[^\\%]", J, Z), "g"),
        PCT_ENCODED: new RegExp(R, "g"),
        IPV4ADDRESS: new RegExp("^(" + ce + ")$"),
        IPV6ADDRESS: new RegExp("^\\[?(" + st + ")" + s(s("\\%25|\\%(?!" + k + "{2})") + "(" + xe + ")") + "?\\]?$")
        //RFC 6874, with relaxed parsing rules
      };
    }
    var d = l(!1), p = l(!0), _ = function() {
      function h(c, y) {
        var k = [], R = !0, U = !1, z = void 0;
        try {
          for (var Z = c[Symbol.iterator](), te; !(R = (te = Z.next()).done) && (k.push(te.value), !(y && k.length === y)); R = !0)
            ;
        } catch (ae) {
          U = !0, z = ae;
        } finally {
          try {
            !R && Z.return && Z.return();
          } finally {
            if (U)
              throw z;
          }
        }
        return k;
      }
      return function(c, y) {
        if (Array.isArray(c))
          return c;
        if (Symbol.iterator in Object(c))
          return h(c, y);
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      };
    }(), b = function(h) {
      if (Array.isArray(h)) {
        for (var c = 0, y = Array(h.length); c < h.length; c++)
          y[c] = h[c];
        return y;
      } else
        return Array.from(h);
    }, P = 2147483647, O = 36, w = 1, g = 26, $ = 38, S = 700, I = 72, D = 128, E = "-", C = /^xn--/, A = /[^\0-\x7E]/, W = /[\x2E\u3002\uFF0E\uFF61]/g, G = {
      overflow: "Overflow: input needs wider integers to process",
      "not-basic": "Illegal input >= 0x80 (not a basic code point)",
      "invalid-input": "Invalid input"
    }, ie = O - w, Y = Math.floor, Pe = String.fromCharCode;
    function fe(h) {
      throw new RangeError(G[h]);
    }
    function Xe(h, c) {
      for (var y = [], k = h.length; k--; )
        y[k] = c(h[k]);
      return y;
    }
    function et(h, c) {
      var y = h.split("@"), k = "";
      y.length > 1 && (k = y[0] + "@", h = y[1]), h = h.replace(W, ".");
      var R = h.split("."), U = Xe(R, c).join(".");
      return k + U;
    }
    function pt(h) {
      for (var c = [], y = 0, k = h.length; y < k; ) {
        var R = h.charCodeAt(y++);
        if (R >= 55296 && R <= 56319 && y < k) {
          var U = h.charCodeAt(y++);
          (U & 64512) == 56320 ? c.push(((R & 1023) << 10) + (U & 1023) + 65536) : (c.push(R), y--);
        } else
          c.push(R);
      }
      return c;
    }
    var It = function(c) {
      return String.fromCodePoint.apply(String, b(c));
    }, ht = function(c) {
      return c - 48 < 10 ? c - 22 : c - 65 < 26 ? c - 65 : c - 97 < 26 ? c - 97 : O;
    }, M = function(c, y) {
      return c + 22 + 75 * (c < 26) - ((y != 0) << 5);
    }, v = function(c, y, k) {
      var R = 0;
      for (
        c = k ? Y(c / S) : c >> 1, c += Y(c / y);
        /* no initialization */
        c > ie * g >> 1;
        R += O
      )
        c = Y(c / ie);
      return Y(R + (ie + 1) * c / (c + $));
    }, j = function(c) {
      var y = [], k = c.length, R = 0, U = D, z = I, Z = c.lastIndexOf(E);
      Z < 0 && (Z = 0);
      for (var te = 0; te < Z; ++te)
        c.charCodeAt(te) >= 128 && fe("not-basic"), y.push(c.charCodeAt(te));
      for (var ae = Z > 0 ? Z + 1 : 0; ae < k; ) {
        for (
          var J = R, ee = 1, ce = O;
          ;
          /* no condition */
          ce += O
        ) {
          ae >= k && fe("invalid-input");
          var x = ht(c.charCodeAt(ae++));
          (x >= O || x > Y((P - R) / ee)) && fe("overflow"), R += x * ee;
          var ne = ce <= z ? w : ce >= z + g ? g : ce - z;
          if (x < ne)
            break;
          var pe = O - ne;
          ee > Y(P / pe) && fe("overflow"), ee *= pe;
        }
        var se = y.length + 1;
        z = v(R - J, se, J == 0), Y(R / se) > P - U && fe("overflow"), U += Y(R / se), R %= se, y.splice(R++, 0, U);
      }
      return String.fromCodePoint.apply(String, y);
    }, T = function(c) {
      var y = [];
      c = pt(c);
      var k = c.length, R = D, U = 0, z = I, Z = !0, te = !1, ae = void 0;
      try {
        for (var J = c[Symbol.iterator](), ee; !(Z = (ee = J.next()).done); Z = !0) {
          var ce = ee.value;
          ce < 128 && y.push(Pe(ce));
        }
      } catch (zt) {
        te = !0, ae = zt;
      } finally {
        try {
          !Z && J.return && J.return();
        } finally {
          if (te)
            throw ae;
        }
      }
      var x = y.length, ne = x;
      for (x && y.push(E); ne < k; ) {
        var pe = P, se = !0, Ke = !1, De = void 0;
        try {
          for (var Me = c[Symbol.iterator](), vt; !(se = (vt = Me.next()).done); se = !0) {
            var nt = vt.value;
            nt >= R && nt < pe && (pe = nt);
          }
        } catch (zt) {
          Ke = !0, De = zt;
        } finally {
          try {
            !se && Me.return && Me.return();
          } finally {
            if (Ke)
              throw De;
          }
        }
        var Te = ne + 1;
        pe - R > Y((P - U) / Te) && fe("overflow"), U += (pe - R) * Te, R = pe;
        var Le = !0, st = !1, xe = void 0;
        try {
          for (var Ut = c[Symbol.iterator](), cs; !(Le = (cs = Ut.next()).done); Le = !0) {
            var ls = cs.value;
            if (ls < R && ++U > P && fe("overflow"), ls == R) {
              for (
                var nr = U, sr = O;
                ;
                /* no condition */
                sr += O
              ) {
                var ir = sr <= z ? w : sr >= z + g ? g : sr - z;
                if (nr < ir)
                  break;
                var us = nr - ir, ds = O - ir;
                y.push(Pe(M(ir + us % ds, 0))), nr = Y(us / ds);
              }
              y.push(Pe(M(nr, 0))), z = v(U, Te, ne == x), U = 0, ++ne;
            }
          }
        } catch (zt) {
          st = !0, xe = zt;
        } finally {
          try {
            !Le && Ut.return && Ut.return();
          } finally {
            if (st)
              throw xe;
          }
        }
        ++U, ++R;
      }
      return y.join("");
    }, a = function(c) {
      return et(c, function(y) {
        return C.test(y) ? j(y.slice(4).toLowerCase()) : y;
      });
    }, m = function(c) {
      return et(c, function(y) {
        return A.test(y) ? "xn--" + T(y) : y;
      });
    }, N = {
      /**
       * A string representing the current Punycode.js version number.
       * @memberOf punycode
       * @type String
       */
      version: "2.1.0",
      /**
       * An object of methods to convert from JavaScript's internal character
       * representation (UCS-2) to Unicode code points, and back.
       * @see <https://mathiasbynens.be/notes/javascript-encoding>
       * @memberOf punycode
       * @type Object
       */
      ucs2: {
        decode: pt,
        encode: It
      },
      decode: j,
      encode: T,
      toASCII: m,
      toUnicode: a
    }, L = {};
    function F(h) {
      var c = h.charCodeAt(0), y = void 0;
      return c < 16 ? y = "%0" + c.toString(16).toUpperCase() : c < 128 ? y = "%" + c.toString(16).toUpperCase() : c < 2048 ? y = "%" + (c >> 6 | 192).toString(16).toUpperCase() + "%" + (c & 63 | 128).toString(16).toUpperCase() : y = "%" + (c >> 12 | 224).toString(16).toUpperCase() + "%" + (c >> 6 & 63 | 128).toString(16).toUpperCase() + "%" + (c & 63 | 128).toString(16).toUpperCase(), y;
    }
    function K(h) {
      for (var c = "", y = 0, k = h.length; y < k; ) {
        var R = parseInt(h.substr(y + 1, 2), 16);
        if (R < 128)
          c += String.fromCharCode(R), y += 3;
        else if (R >= 194 && R < 224) {
          if (k - y >= 6) {
            var U = parseInt(h.substr(y + 4, 2), 16);
            c += String.fromCharCode((R & 31) << 6 | U & 63);
          } else
            c += h.substr(y, 6);
          y += 6;
        } else if (R >= 224) {
          if (k - y >= 9) {
            var z = parseInt(h.substr(y + 4, 2), 16), Z = parseInt(h.substr(y + 7, 2), 16);
            c += String.fromCharCode((R & 15) << 12 | (z & 63) << 6 | Z & 63);
          } else
            c += h.substr(y, 9);
          y += 9;
        } else
          c += h.substr(y, 3), y += 3;
      }
      return c;
    }
    function Q(h, c) {
      function y(k) {
        var R = K(k);
        return R.match(c.UNRESERVED) ? R : k;
      }
      return h.scheme && (h.scheme = String(h.scheme).replace(c.PCT_ENCODED, y).toLowerCase().replace(c.NOT_SCHEME, "")), h.userinfo !== void 0 && (h.userinfo = String(h.userinfo).replace(c.PCT_ENCODED, y).replace(c.NOT_USERINFO, F).replace(c.PCT_ENCODED, o)), h.host !== void 0 && (h.host = String(h.host).replace(c.PCT_ENCODED, y).toLowerCase().replace(c.NOT_HOST, F).replace(c.PCT_ENCODED, o)), h.path !== void 0 && (h.path = String(h.path).replace(c.PCT_ENCODED, y).replace(h.scheme ? c.NOT_PATH : c.NOT_PATH_NOSCHEME, F).replace(c.PCT_ENCODED, o)), h.query !== void 0 && (h.query = String(h.query).replace(c.PCT_ENCODED, y).replace(c.NOT_QUERY, F).replace(c.PCT_ENCODED, o)), h.fragment !== void 0 && (h.fragment = String(h.fragment).replace(c.PCT_ENCODED, y).replace(c.NOT_FRAGMENT, F).replace(c.PCT_ENCODED, o)), h;
    }
    function oe(h) {
      return h.replace(/^0*(.*)/, "$1") || "0";
    }
    function Ie(h, c) {
      var y = h.match(c.IPV4ADDRESS) || [], k = _(y, 2), R = k[1];
      return R ? R.split(".").map(oe).join(".") : h;
    }
    function mt(h, c) {
      var y = h.match(c.IPV6ADDRESS) || [], k = _(y, 3), R = k[1], U = k[2];
      if (R) {
        for (var z = R.toLowerCase().split("::").reverse(), Z = _(z, 2), te = Z[0], ae = Z[1], J = ae ? ae.split(":").map(oe) : [], ee = te.split(":").map(oe), ce = c.IPV4ADDRESS.test(ee[ee.length - 1]), x = ce ? 7 : 8, ne = ee.length - x, pe = Array(x), se = 0; se < x; ++se)
          pe[se] = J[se] || ee[ne + se] || "";
        ce && (pe[x - 1] = Ie(pe[x - 1], c));
        var Ke = pe.reduce(function(Te, Le, st) {
          if (!Le || Le === "0") {
            var xe = Te[Te.length - 1];
            xe && xe.index + xe.length === st ? xe.length++ : Te.push({ index: st, length: 1 });
          }
          return Te;
        }, []), De = Ke.sort(function(Te, Le) {
          return Le.length - Te.length;
        })[0], Me = void 0;
        if (De && De.length > 1) {
          var vt = pe.slice(0, De.index), nt = pe.slice(De.index + De.length);
          Me = vt.join(":") + "::" + nt.join(":");
        } else
          Me = pe.join(":");
        return U && (Me += "%" + U), Me;
      } else
        return h;
    }
    var jt = /^(?:([^:\/?#]+):)?(?:\/\/((?:([^\/?#@]*)@)?(\[[^\/?#\]]+\]|[^\/?#:]*)(?:\:(\d*))?))?([^?#]*)(?:\?([^#]*))?(?:#((?:.|\n|\r)*))?/i, At = "".match(/(){0}/)[1] === void 0;
    function be(h) {
      var c = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, y = {}, k = c.iri !== !1 ? p : d;
      c.reference === "suffix" && (h = (c.scheme ? c.scheme + ":" : "") + "//" + h);
      var R = h.match(jt);
      if (R) {
        At ? (y.scheme = R[1], y.userinfo = R[3], y.host = R[4], y.port = parseInt(R[5], 10), y.path = R[6] || "", y.query = R[7], y.fragment = R[8], isNaN(y.port) && (y.port = R[5])) : (y.scheme = R[1] || void 0, y.userinfo = h.indexOf("@") !== -1 ? R[3] : void 0, y.host = h.indexOf("//") !== -1 ? R[4] : void 0, y.port = parseInt(R[5], 10), y.path = R[6] || "", y.query = h.indexOf("?") !== -1 ? R[7] : void 0, y.fragment = h.indexOf("#") !== -1 ? R[8] : void 0, isNaN(y.port) && (y.port = h.match(/\/\/(?:.|\n)*\:(?:\/|\?|\#|$)/) ? R[4] : void 0)), y.host && (y.host = mt(Ie(y.host, k), k)), y.scheme === void 0 && y.userinfo === void 0 && y.host === void 0 && y.port === void 0 && !y.path && y.query === void 0 ? y.reference = "same-document" : y.scheme === void 0 ? y.reference = "relative" : y.fragment === void 0 ? y.reference = "absolute" : y.reference = "uri", c.reference && c.reference !== "suffix" && c.reference !== y.reference && (y.error = y.error || "URI is not a " + c.reference + " reference.");
        var U = L[(c.scheme || y.scheme || "").toLowerCase()];
        if (!c.unicodeSupport && (!U || !U.unicodeSupport)) {
          if (y.host && (c.domainHost || U && U.domainHost))
            try {
              y.host = N.toASCII(y.host.replace(k.PCT_ENCODED, K).toLowerCase());
            } catch (z) {
              y.error = y.error || "Host's domain name can not be converted to ASCII via punycode: " + z;
            }
          Q(y, d);
        } else
          Q(y, k);
        U && U.parse && U.parse(y, c);
      } else
        y.error = y.error || "URI can not be parsed.";
      return y;
    }
    function Dt(h, c) {
      var y = c.iri !== !1 ? p : d, k = [];
      return h.userinfo !== void 0 && (k.push(h.userinfo), k.push("@")), h.host !== void 0 && k.push(mt(Ie(String(h.host), y), y).replace(y.IPV6ADDRESS, function(R, U, z) {
        return "[" + U + (z ? "%25" + z : "") + "]";
      })), (typeof h.port == "number" || typeof h.port == "string") && (k.push(":"), k.push(String(h.port))), k.length ? k.join("") : void 0;
    }
    var yt = /^\.\.?\//, gt = /^\/\.(\/|$)/, $t = /^\/\.\.(\/|$)/, Mt = /^\/?(?:.|\n)*?(?=\/|$)/;
    function je(h) {
      for (var c = []; h.length; )
        if (h.match(yt))
          h = h.replace(yt, "");
        else if (h.match(gt))
          h = h.replace(gt, "/");
        else if (h.match($t))
          h = h.replace($t, "/"), c.pop();
        else if (h === "." || h === "..")
          h = "";
        else {
          var y = h.match(Mt);
          if (y) {
            var k = y[0];
            h = h.slice(k.length), c.push(k);
          } else
            throw new Error("Unexpected dot segment condition");
        }
      return c.join("");
    }
    function _e(h) {
      var c = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, y = c.iri ? p : d, k = [], R = L[(c.scheme || h.scheme || "").toLowerCase()];
      if (R && R.serialize && R.serialize(h, c), h.host && !y.IPV6ADDRESS.test(h.host)) {
        if (c.domainHost || R && R.domainHost)
          try {
            h.host = c.iri ? N.toUnicode(h.host) : N.toASCII(h.host.replace(y.PCT_ENCODED, K).toLowerCase());
          } catch (Z) {
            h.error = h.error || "Host's domain name can not be converted to " + (c.iri ? "Unicode" : "ASCII") + " via punycode: " + Z;
          }
      }
      Q(h, y), c.reference !== "suffix" && h.scheme && (k.push(h.scheme), k.push(":"));
      var U = Dt(h, c);
      if (U !== void 0 && (c.reference !== "suffix" && k.push("//"), k.push(U), h.path && h.path.charAt(0) !== "/" && k.push("/")), h.path !== void 0) {
        var z = h.path;
        !c.absolutePath && (!R || !R.absolutePath) && (z = je(z)), U === void 0 && (z = z.replace(/^\/\//, "/%2F")), k.push(z);
      }
      return h.query !== void 0 && (k.push("?"), k.push(h.query)), h.fragment !== void 0 && (k.push("#"), k.push(h.fragment)), k.join("");
    }
    function _t(h, c) {
      var y = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, k = arguments[3], R = {};
      return k || (h = be(_e(h, y), y), c = be(_e(c, y), y)), y = y || {}, !y.tolerant && c.scheme ? (R.scheme = c.scheme, R.userinfo = c.userinfo, R.host = c.host, R.port = c.port, R.path = je(c.path || ""), R.query = c.query) : (c.userinfo !== void 0 || c.host !== void 0 || c.port !== void 0 ? (R.userinfo = c.userinfo, R.host = c.host, R.port = c.port, R.path = je(c.path || ""), R.query = c.query) : (c.path ? (c.path.charAt(0) === "/" ? R.path = je(c.path) : ((h.userinfo !== void 0 || h.host !== void 0 || h.port !== void 0) && !h.path ? R.path = "/" + c.path : h.path ? R.path = h.path.slice(0, h.path.lastIndexOf("/") + 1) + c.path : R.path = c.path, R.path = je(R.path)), R.query = c.query) : (R.path = h.path, c.query !== void 0 ? R.query = c.query : R.query = h.query), R.userinfo = h.userinfo, R.host = h.host, R.port = h.port), R.scheme = h.scheme), R.fragment = c.fragment, R;
    }
    function Lt(h, c, y) {
      var k = f({ scheme: "null" }, y);
      return _e(_t(be(h, k), be(c, k), k, !0), k);
    }
    function tt(h, c) {
      return typeof h == "string" ? h = _e(be(h, c), c) : i(h) === "object" && (h = be(_e(h, c), c)), h;
    }
    function Ft(h, c, y) {
      return typeof h == "string" ? h = _e(be(h, y), y) : i(h) === "object" && (h = _e(h, y)), typeof c == "string" ? c = _e(be(c, y), y) : i(c) === "object" && (c = _e(c, y)), h === c;
    }
    function rr(h, c) {
      return h && h.toString().replace(!c || !c.iri ? d.ESCAPE : p.ESCAPE, F);
    }
    function Se(h, c) {
      return h && h.toString().replace(!c || !c.iri ? d.PCT_ENCODED : p.PCT_ENCODED, K);
    }
    var rt = {
      scheme: "http",
      domainHost: !0,
      parse: function(c, y) {
        return c.host || (c.error = c.error || "HTTP URIs must have a host."), c;
      },
      serialize: function(c, y) {
        var k = String(c.scheme).toLowerCase() === "https";
        return (c.port === (k ? 443 : 80) || c.port === "") && (c.port = void 0), c.path || (c.path = "/"), c;
      }
    }, es = {
      scheme: "https",
      domainHost: rt.domainHost,
      parse: rt.parse,
      serialize: rt.serialize
    };
    function ts(h) {
      return typeof h.secure == "boolean" ? h.secure : String(h.scheme).toLowerCase() === "wss";
    }
    var qt = {
      scheme: "ws",
      domainHost: !0,
      parse: function(c, y) {
        var k = c;
        return k.secure = ts(k), k.resourceName = (k.path || "/") + (k.query ? "?" + k.query : ""), k.path = void 0, k.query = void 0, k;
      },
      serialize: function(c, y) {
        if ((c.port === (ts(c) ? 443 : 80) || c.port === "") && (c.port = void 0), typeof c.secure == "boolean" && (c.scheme = c.secure ? "wss" : "ws", c.secure = void 0), c.resourceName) {
          var k = c.resourceName.split("?"), R = _(k, 2), U = R[0], z = R[1];
          c.path = U && U !== "/" ? U : void 0, c.query = z, c.resourceName = void 0;
        }
        return c.fragment = void 0, c;
      }
    }, rs = {
      scheme: "wss",
      domainHost: qt.domainHost,
      parse: qt.parse,
      serialize: qt.serialize
    }, eo = {}, ns = "[A-Za-z0-9\\-\\.\\_\\~\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]", Ae = "[0-9A-Fa-f]", to = s(s("%[EFef]" + Ae + "%" + Ae + Ae + "%" + Ae + Ae) + "|" + s("%[89A-Fa-f]" + Ae + "%" + Ae + Ae) + "|" + s("%" + Ae + Ae)), ro = "[A-Za-z0-9\\!\\$\\%\\'\\*\\+\\-\\^\\_\\`\\{\\|\\}\\~]", no = "[\\!\\$\\%\\'\\(\\)\\*\\+\\,\\-\\.0-9\\<\\>A-Z\\x5E-\\x7E]", so = n(no, '[\\"\\\\]'), io = "[\\!\\$\\'\\(\\)\\*\\+\\,\\;\\:\\@]", oo = new RegExp(ns, "g"), wt = new RegExp(to, "g"), ao = new RegExp(n("[^]", ro, "[\\.]", '[\\"]', so), "g"), ss = new RegExp(n("[^]", ns, io), "g"), co = ss;
    function Fr(h) {
      var c = K(h);
      return c.match(oo) ? c : h;
    }
    var is = {
      scheme: "mailto",
      parse: function(c, y) {
        var k = c, R = k.to = k.path ? k.path.split(",") : [];
        if (k.path = void 0, k.query) {
          for (var U = !1, z = {}, Z = k.query.split("&"), te = 0, ae = Z.length; te < ae; ++te) {
            var J = Z[te].split("=");
            switch (J[0]) {
              case "to":
                for (var ee = J[1].split(","), ce = 0, x = ee.length; ce < x; ++ce)
                  R.push(ee[ce]);
                break;
              case "subject":
                k.subject = Se(J[1], y);
                break;
              case "body":
                k.body = Se(J[1], y);
                break;
              default:
                U = !0, z[Se(J[0], y)] = Se(J[1], y);
                break;
            }
          }
          U && (k.headers = z);
        }
        k.query = void 0;
        for (var ne = 0, pe = R.length; ne < pe; ++ne) {
          var se = R[ne].split("@");
          if (se[0] = Se(se[0]), y.unicodeSupport)
            se[1] = Se(se[1], y).toLowerCase();
          else
            try {
              se[1] = N.toASCII(Se(se[1], y).toLowerCase());
            } catch (Ke) {
              k.error = k.error || "Email address's domain name can not be converted to ASCII via punycode: " + Ke;
            }
          R[ne] = se.join("@");
        }
        return k;
      },
      serialize: function(c, y) {
        var k = c, R = u(c.to);
        if (R) {
          for (var U = 0, z = R.length; U < z; ++U) {
            var Z = String(R[U]), te = Z.lastIndexOf("@"), ae = Z.slice(0, te).replace(wt, Fr).replace(wt, o).replace(ao, F), J = Z.slice(te + 1);
            try {
              J = y.iri ? N.toUnicode(J) : N.toASCII(Se(J, y).toLowerCase());
            } catch (ne) {
              k.error = k.error || "Email address's domain name can not be converted to " + (y.iri ? "Unicode" : "ASCII") + " via punycode: " + ne;
            }
            R[U] = ae + "@" + J;
          }
          k.path = R.join(",");
        }
        var ee = c.headers = c.headers || {};
        c.subject && (ee.subject = c.subject), c.body && (ee.body = c.body);
        var ce = [];
        for (var x in ee)
          ee[x] !== eo[x] && ce.push(x.replace(wt, Fr).replace(wt, o).replace(ss, F) + "=" + ee[x].replace(wt, Fr).replace(wt, o).replace(co, F));
        return ce.length && (k.query = ce.join("&")), k;
      }
    }, lo = /^([^\:]+)\:(.*)/, os = {
      scheme: "urn",
      parse: function(c, y) {
        var k = c.path && c.path.match(lo), R = c;
        if (k) {
          var U = y.scheme || R.scheme || "urn", z = k[1].toLowerCase(), Z = k[2], te = U + ":" + (y.nid || z), ae = L[te];
          R.nid = z, R.nss = Z, R.path = void 0, ae && (R = ae.parse(R, y));
        } else
          R.error = R.error || "URN can not be parsed.";
        return R;
      },
      serialize: function(c, y) {
        var k = y.scheme || c.scheme || "urn", R = c.nid, U = k + ":" + (y.nid || R), z = L[U];
        z && (c = z.serialize(c, y));
        var Z = c, te = c.nss;
        return Z.path = (R || y.nid) + ":" + te, Z;
      }
    }, uo = /^[0-9A-Fa-f]{8}(?:\-[0-9A-Fa-f]{4}){3}\-[0-9A-Fa-f]{12}$/, as = {
      scheme: "urn:uuid",
      parse: function(c, y) {
        var k = c;
        return k.uuid = k.nss, k.nss = void 0, !y.tolerant && (!k.uuid || !k.uuid.match(uo)) && (k.error = k.error || "UUID is not valid."), k;
      },
      serialize: function(c, y) {
        var k = c;
        return k.nss = (c.uuid || "").toLowerCase(), k;
      }
    };
    L[rt.scheme] = rt, L[es.scheme] = es, L[qt.scheme] = qt, L[rs.scheme] = rs, L[is.scheme] = is, L[os.scheme] = os, L[as.scheme] = as, r.SCHEMES = L, r.pctEncChar = F, r.pctDecChars = K, r.parse = be, r.removeDotSegments = je, r.serialize = _e, r.resolveComponents = _t, r.resolve = Lt, r.normalize = tt, r.equal = Ft, r.escapeComponent = rr, r.unescapeComponent = Se, Object.defineProperty(r, "__esModule", { value: !0 });
  });
})(sn, sn.exports);
var Xc = sn.exports;
Object.defineProperty(wn, "__esModule", { value: !0 });
const Mi = Xc;
Mi.code = 'require("ajv/dist/runtime/uri").default';
wn.default = Mi;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = Ne;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return t.KeywordCxt;
  } });
  var r = B;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return r._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return r.str;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return r.stringify;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return r.nil;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return r.Name;
  } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
    return r.CodeGen;
  } });
  const n = Xt, s = er, i = ut, o = ve, u = B, f = ye, l = Zt, d = X, p = Zc, _ = wn, b = (M, v) => new RegExp(M, v);
  b.code = "new RegExp";
  const P = ["removeAdditional", "useDefaults", "coerceTypes"], O = /* @__PURE__ */ new Set([
    "validate",
    "serialize",
    "parse",
    "wrapper",
    "root",
    "schema",
    "keyword",
    "pattern",
    "formats",
    "validate$data",
    "func",
    "obj",
    "Error"
  ]), w = {
    errorDataPath: "",
    format: "`validateFormats: false` can be used instead.",
    nullable: '"nullable" keyword is supported by default.',
    jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
    extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
    missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
    processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
    sourceCode: "Use option `code: {source: true}`",
    strictDefaults: "It is default now, see option `strict`.",
    strictKeywords: "It is default now, see option `strict`.",
    uniqueItems: '"uniqueItems" keyword is always validated.',
    unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
    cache: "Map is used as cache, schema object as key.",
    serialize: "Map is used as cache, schema object as key.",
    ajvErrors: "It is default now."
  }, g = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.'
  }, $ = 200;
  function S(M) {
    var v, j, T, a, m, N, L, F, K, Q, oe, Ie, mt, jt, At, be, Dt, yt, gt, $t, Mt, je, _e, _t, Lt;
    const tt = M.strict, Ft = (v = M.code) === null || v === void 0 ? void 0 : v.optimize, rr = Ft === !0 || Ft === void 0 ? 1 : Ft || 0, Se = (T = (j = M.code) === null || j === void 0 ? void 0 : j.regExp) !== null && T !== void 0 ? T : b, rt = (a = M.uriResolver) !== null && a !== void 0 ? a : _.default;
    return {
      strictSchema: (N = (m = M.strictSchema) !== null && m !== void 0 ? m : tt) !== null && N !== void 0 ? N : !0,
      strictNumbers: (F = (L = M.strictNumbers) !== null && L !== void 0 ? L : tt) !== null && F !== void 0 ? F : !0,
      strictTypes: (Q = (K = M.strictTypes) !== null && K !== void 0 ? K : tt) !== null && Q !== void 0 ? Q : "log",
      strictTuples: (Ie = (oe = M.strictTuples) !== null && oe !== void 0 ? oe : tt) !== null && Ie !== void 0 ? Ie : "log",
      strictRequired: (jt = (mt = M.strictRequired) !== null && mt !== void 0 ? mt : tt) !== null && jt !== void 0 ? jt : !1,
      code: M.code ? { ...M.code, optimize: rr, regExp: Se } : { optimize: rr, regExp: Se },
      loopRequired: (At = M.loopRequired) !== null && At !== void 0 ? At : $,
      loopEnum: (be = M.loopEnum) !== null && be !== void 0 ? be : $,
      meta: (Dt = M.meta) !== null && Dt !== void 0 ? Dt : !0,
      messages: (yt = M.messages) !== null && yt !== void 0 ? yt : !0,
      inlineRefs: (gt = M.inlineRefs) !== null && gt !== void 0 ? gt : !0,
      schemaId: ($t = M.schemaId) !== null && $t !== void 0 ? $t : "$id",
      addUsedSchema: (Mt = M.addUsedSchema) !== null && Mt !== void 0 ? Mt : !0,
      validateSchema: (je = M.validateSchema) !== null && je !== void 0 ? je : !0,
      validateFormats: (_e = M.validateFormats) !== null && _e !== void 0 ? _e : !0,
      unicodeRegExp: (_t = M.unicodeRegExp) !== null && _t !== void 0 ? _t : !0,
      int32range: (Lt = M.int32range) !== null && Lt !== void 0 ? Lt : !0,
      uriResolver: rt
    };
  }
  class I {
    constructor(v = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), v = this.opts = { ...v, ...S(v) };
      const { es5: j, lines: T } = this.opts.code;
      this.scope = new u.ValueScope({ scope: {}, prefixes: O, es5: j, lines: T }), this.logger = Y(v.logger);
      const a = v.validateFormats;
      v.validateFormats = !1, this.RULES = (0, i.getRules)(), D.call(this, w, v, "NOT SUPPORTED"), D.call(this, g, v, "DEPRECATED", "warn"), this._metaOpts = G.call(this), v.formats && A.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), v.keywords && W.call(this, v.keywords), typeof v.meta == "object" && this.addMetaSchema(v.meta), C.call(this), v.validateFormats = a;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: v, meta: j, schemaId: T } = this.opts;
      let a = p;
      T === "id" && (a = { ...p }, a.id = a.$id, delete a.$id), j && v && this.addMetaSchema(a, a[T], !1);
    }
    defaultMeta() {
      const { meta: v, schemaId: j } = this.opts;
      return this.opts.defaultMeta = typeof v == "object" ? v[j] || v : void 0;
    }
    validate(v, j) {
      let T;
      if (typeof v == "string") {
        if (T = this.getSchema(v), !T)
          throw new Error(`no schema with key or ref "${v}"`);
      } else
        T = this.compile(v);
      const a = T(j);
      return "$async" in T || (this.errors = T.errors), a;
    }
    compile(v, j) {
      const T = this._addSchema(v, j);
      return T.validate || this._compileSchemaEnv(T);
    }
    compileAsync(v, j) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: T } = this.opts;
      return a.call(this, v, j);
      async function a(Q, oe) {
        await m.call(this, Q.$schema);
        const Ie = this._addSchema(Q, oe);
        return Ie.validate || N.call(this, Ie);
      }
      async function m(Q) {
        Q && !this.getSchema(Q) && await a.call(this, { $ref: Q }, !0);
      }
      async function N(Q) {
        try {
          return this._compileSchemaEnv(Q);
        } catch (oe) {
          if (!(oe instanceof s.default))
            throw oe;
          return L.call(this, oe), await F.call(this, oe.missingSchema), N.call(this, Q);
        }
      }
      function L({ missingSchema: Q, missingRef: oe }) {
        if (this.refs[Q])
          throw new Error(`AnySchema ${Q} is loaded but ${oe} cannot be resolved`);
      }
      async function F(Q) {
        const oe = await K.call(this, Q);
        this.refs[Q] || await m.call(this, oe.$schema), this.refs[Q] || this.addSchema(oe, Q, j);
      }
      async function K(Q) {
        const oe = this._loading[Q];
        if (oe)
          return oe;
        try {
          return await (this._loading[Q] = T(Q));
        } finally {
          delete this._loading[Q];
        }
      }
    }
    // Adds schema to the instance
    addSchema(v, j, T, a = this.opts.validateSchema) {
      if (Array.isArray(v)) {
        for (const N of v)
          this.addSchema(N, void 0, T, a);
        return this;
      }
      let m;
      if (typeof v == "object") {
        const { schemaId: N } = this.opts;
        if (m = v[N], m !== void 0 && typeof m != "string")
          throw new Error(`schema ${N} must be string`);
      }
      return j = (0, f.normalizeId)(j || m), this._checkUnique(j), this.schemas[j] = this._addSchema(v, T, j, a, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(v, j, T = this.opts.validateSchema) {
      return this.addSchema(v, j, !0, T), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(v, j) {
      if (typeof v == "boolean")
        return !0;
      let T;
      if (T = v.$schema, T !== void 0 && typeof T != "string")
        throw new Error("$schema must be a string");
      if (T = T || this.opts.defaultMeta || this.defaultMeta(), !T)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const a = this.validate(T, v);
      if (!a && j) {
        const m = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error(m);
        else
          throw new Error(m);
      }
      return a;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(v) {
      let j;
      for (; typeof (j = E.call(this, v)) == "string"; )
        v = j;
      if (j === void 0) {
        const { schemaId: T } = this.opts, a = new o.SchemaEnv({ schema: {}, schemaId: T });
        if (j = o.resolveSchema.call(this, a, v), !j)
          return;
        this.refs[v] = j;
      }
      return j.validate || this._compileSchemaEnv(j);
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(v) {
      if (v instanceof RegExp)
        return this._removeAllSchemas(this.schemas, v), this._removeAllSchemas(this.refs, v), this;
      switch (typeof v) {
        case "undefined":
          return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
        case "string": {
          const j = E.call(this, v);
          return typeof j == "object" && this._cache.delete(j.schema), delete this.schemas[v], delete this.refs[v], this;
        }
        case "object": {
          const j = v;
          this._cache.delete(j);
          let T = v[this.opts.schemaId];
          return T && (T = (0, f.normalizeId)(T), delete this.schemas[T], delete this.refs[T]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(v) {
      for (const j of v)
        this.addKeyword(j);
      return this;
    }
    addKeyword(v, j) {
      let T;
      if (typeof v == "string")
        T = v, typeof j == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), j.keyword = T);
      else if (typeof v == "object" && j === void 0) {
        if (j = v, T = j.keyword, Array.isArray(T) && !T.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (fe.call(this, T, j), !j)
        return (0, d.eachItem)(T, (m) => Xe.call(this, m)), this;
      pt.call(this, j);
      const a = {
        ...j,
        type: (0, l.getJSONTypes)(j.type),
        schemaType: (0, l.getJSONTypes)(j.schemaType)
      };
      return (0, d.eachItem)(T, a.type.length === 0 ? (m) => Xe.call(this, m, a) : (m) => a.type.forEach((N) => Xe.call(this, m, a, N))), this;
    }
    getKeyword(v) {
      const j = this.RULES.all[v];
      return typeof j == "object" ? j.definition : !!j;
    }
    // Remove keyword
    removeKeyword(v) {
      const { RULES: j } = this;
      delete j.keywords[v], delete j.all[v];
      for (const T of j.rules) {
        const a = T.rules.findIndex((m) => m.keyword === v);
        a >= 0 && T.rules.splice(a, 1);
      }
      return this;
    }
    // Add format
    addFormat(v, j) {
      return typeof j == "string" && (j = new RegExp(j)), this.formats[v] = j, this;
    }
    errorsText(v = this.errors, { separator: j = ", ", dataVar: T = "data" } = {}) {
      return !v || v.length === 0 ? "No errors" : v.map((a) => `${T}${a.instancePath} ${a.message}`).reduce((a, m) => a + j + m);
    }
    $dataMetaSchema(v, j) {
      const T = this.RULES.all;
      v = JSON.parse(JSON.stringify(v));
      for (const a of j) {
        const m = a.split("/").slice(1);
        let N = v;
        for (const L of m)
          N = N[L];
        for (const L in T) {
          const F = T[L];
          if (typeof F != "object")
            continue;
          const { $data: K } = F.definition, Q = N[L];
          K && Q && (N[L] = ht(Q));
        }
      }
      return v;
    }
    _removeAllSchemas(v, j) {
      for (const T in v) {
        const a = v[T];
        (!j || j.test(T)) && (typeof a == "string" ? delete v[T] : a && !a.meta && (this._cache.delete(a.schema), delete v[T]));
      }
    }
    _addSchema(v, j, T, a = this.opts.validateSchema, m = this.opts.addUsedSchema) {
      let N;
      const { schemaId: L } = this.opts;
      if (typeof v == "object")
        N = v[L];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof v != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let F = this._cache.get(v);
      if (F !== void 0)
        return F;
      T = (0, f.normalizeId)(N || T);
      const K = f.getSchemaRefs.call(this, v, T);
      return F = new o.SchemaEnv({ schema: v, schemaId: L, meta: j, baseId: T, localRefs: K }), this._cache.set(F.schema, F), m && !T.startsWith("#") && (T && this._checkUnique(T), this.refs[T] = F), a && this.validateSchema(v, !0), F;
    }
    _checkUnique(v) {
      if (this.schemas[v] || this.refs[v])
        throw new Error(`schema with key or id "${v}" already exists`);
    }
    _compileSchemaEnv(v) {
      if (v.meta ? this._compileMetaSchema(v) : o.compileSchema.call(this, v), !v.validate)
        throw new Error("ajv implementation error");
      return v.validate;
    }
    _compileMetaSchema(v) {
      const j = this.opts;
      this.opts = this._metaOpts;
      try {
        o.compileSchema.call(this, v);
      } finally {
        this.opts = j;
      }
    }
  }
  e.default = I, I.ValidationError = n.default, I.MissingRefError = s.default;
  function D(M, v, j, T = "error") {
    for (const a in M) {
      const m = a;
      m in v && this.logger[T](`${j}: option ${a}. ${M[m]}`);
    }
  }
  function E(M) {
    return M = (0, f.normalizeId)(M), this.schemas[M] || this.refs[M];
  }
  function C() {
    const M = this.opts.schemas;
    if (M)
      if (Array.isArray(M))
        this.addSchema(M);
      else
        for (const v in M)
          this.addSchema(M[v], v);
  }
  function A() {
    for (const M in this.opts.formats) {
      const v = this.opts.formats[M];
      v && this.addFormat(M, v);
    }
  }
  function W(M) {
    if (Array.isArray(M)) {
      this.addVocabulary(M);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const v in M) {
      const j = M[v];
      j.keyword || (j.keyword = v), this.addKeyword(j);
    }
  }
  function G() {
    const M = { ...this.opts };
    for (const v of P)
      delete M[v];
    return M;
  }
  const ie = { log() {
  }, warn() {
  }, error() {
  } };
  function Y(M) {
    if (M === !1)
      return ie;
    if (M === void 0)
      return console;
    if (M.log && M.warn && M.error)
      return M;
    throw new Error("logger must implement log, warn and error methods");
  }
  const Pe = /^[a-z_$][a-z0-9_$:-]*$/i;
  function fe(M, v) {
    const { RULES: j } = this;
    if ((0, d.eachItem)(M, (T) => {
      if (j.keywords[T])
        throw new Error(`Keyword ${T} is already defined`);
      if (!Pe.test(T))
        throw new Error(`Keyword ${T} has invalid name`);
    }), !!v && v.$data && !("code" in v || "validate" in v))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function Xe(M, v, j) {
    var T;
    const a = v == null ? void 0 : v.post;
    if (j && a)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: m } = this;
    let N = a ? m.post : m.rules.find(({ type: F }) => F === j);
    if (N || (N = { type: j, rules: [] }, m.rules.push(N)), m.keywords[M] = !0, !v)
      return;
    const L = {
      keyword: M,
      definition: {
        ...v,
        type: (0, l.getJSONTypes)(v.type),
        schemaType: (0, l.getJSONTypes)(v.schemaType)
      }
    };
    v.before ? et.call(this, N, L, v.before) : N.rules.push(L), m.all[M] = L, (T = v.implements) === null || T === void 0 || T.forEach((F) => this.addKeyword(F));
  }
  function et(M, v, j) {
    const T = M.rules.findIndex((a) => a.keyword === j);
    T >= 0 ? M.rules.splice(T, 0, v) : (M.rules.push(v), this.logger.warn(`rule ${j} is not defined`));
  }
  function pt(M) {
    let { metaSchema: v } = M;
    v !== void 0 && (M.$data && this.opts.$data && (v = ht(v)), M.validateSchema = this.compile(v, !0));
  }
  const It = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function ht(M) {
    return { anyOf: [M, It] };
  }
})(di);
var vn = {}, bn = {}, En = {};
Object.defineProperty(En, "__esModule", { value: !0 });
const el = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
En.default = el;
var dt = {};
Object.defineProperty(dt, "__esModule", { value: !0 });
dt.callRef = dt.getValidate = void 0;
const tl = er, Rs = H, we = B, Et = We, ks = ve, or = X, rl = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: s, schemaEnv: i, validateName: o, opts: u, self: f } = n, { root: l } = i;
    if ((r === "#" || r === "#/") && s === l.baseId)
      return p();
    const d = ks.resolveRef.call(f, l, s, r);
    if (d === void 0)
      throw new tl.default(n.opts.uriResolver, s, r);
    if (d instanceof ks.SchemaEnv)
      return _(d);
    return b(d);
    function p() {
      if (i === l)
        return mr(e, o, i, i.$async);
      const P = t.scopeValue("root", { ref: l });
      return mr(e, (0, we._)`${P}.validate`, l, l.$async);
    }
    function _(P) {
      const O = Li(e, P);
      mr(e, O, P, P.$async);
    }
    function b(P) {
      const O = t.scopeValue("schema", u.code.source === !0 ? { ref: P, code: (0, we.stringify)(P) } : { ref: P }), w = t.name("valid"), g = e.subschema({
        schema: P,
        dataTypes: [],
        schemaPath: we.nil,
        topSchemaRef: O,
        errSchemaPath: r
      }, w);
      e.mergeEvaluated(g), e.ok(w);
    }
  }
};
function Li(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, we._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
dt.getValidate = Li;
function mr(e, t, r, n) {
  const { gen: s, it: i } = e, { allErrors: o, schemaEnv: u, opts: f } = i, l = f.passContext ? Et.default.this : we.nil;
  n ? d() : p();
  function d() {
    if (!u.$async)
      throw new Error("async schema referenced by sync schema");
    const P = s.let("valid");
    s.try(() => {
      s.code((0, we._)`await ${(0, Rs.callValidateCode)(e, t, l)}`), b(t), o || s.assign(P, !0);
    }, (O) => {
      s.if((0, we._)`!(${O} instanceof ${i.ValidationError})`, () => s.throw(O)), _(O), o || s.assign(P, !1);
    }), e.ok(P);
  }
  function p() {
    e.result((0, Rs.callValidateCode)(e, t, l), () => b(t), () => _(t));
  }
  function _(P) {
    const O = (0, we._)`${P}.errors`;
    s.assign(Et.default.vErrors, (0, we._)`${Et.default.vErrors} === null ? ${O} : ${Et.default.vErrors}.concat(${O})`), s.assign(Et.default.errors, (0, we._)`${Et.default.vErrors}.length`);
  }
  function b(P) {
    var O;
    if (!i.opts.unevaluated)
      return;
    const w = (O = r == null ? void 0 : r.validate) === null || O === void 0 ? void 0 : O.evaluated;
    if (i.props !== !0)
      if (w && !w.dynamicProps)
        w.props !== void 0 && (i.props = or.mergeEvaluated.props(s, w.props, i.props));
      else {
        const g = s.var("props", (0, we._)`${P}.evaluated.props`);
        i.props = or.mergeEvaluated.props(s, g, i.props, we.Name);
      }
    if (i.items !== !0)
      if (w && !w.dynamicItems)
        w.items !== void 0 && (i.items = or.mergeEvaluated.items(s, w.items, i.items));
      else {
        const g = s.var("items", (0, we._)`${P}.evaluated.items`);
        i.items = or.mergeEvaluated.items(s, g, i.items, we.Name);
      }
  }
}
dt.callRef = mr;
dt.default = rl;
Object.defineProperty(bn, "__esModule", { value: !0 });
const nl = En, sl = dt, il = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  nl.default,
  sl.default
];
bn.default = il;
var Pn = {}, Sn = {};
Object.defineProperty(Sn, "__esModule", { value: !0 });
const Pr = B, Qe = Pr.operators, Sr = {
  maximum: { okStr: "<=", ok: Qe.LTE, fail: Qe.GT },
  minimum: { okStr: ">=", ok: Qe.GTE, fail: Qe.LT },
  exclusiveMaximum: { okStr: "<", ok: Qe.LT, fail: Qe.GTE },
  exclusiveMinimum: { okStr: ">", ok: Qe.GT, fail: Qe.LTE }
}, ol = {
  message: ({ keyword: e, schemaCode: t }) => (0, Pr.str)`must be ${Sr[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, Pr._)`{comparison: ${Sr[e].okStr}, limit: ${t}}`
}, al = {
  keyword: Object.keys(Sr),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: ol,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, Pr._)`${r} ${Sr[t].fail} ${n} || isNaN(${r})`);
  }
};
Sn.default = al;
var Tn = {};
Object.defineProperty(Tn, "__esModule", { value: !0 });
const Bt = B, cl = {
  message: ({ schemaCode: e }) => (0, Bt.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, Bt._)`{multipleOf: ${e}}`
}, ll = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: cl,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: s } = e, i = s.opts.multipleOfPrecision, o = t.let("res"), u = i ? (0, Bt._)`Math.abs(Math.round(${o}) - ${o}) > 1e-${i}` : (0, Bt._)`${o} !== parseInt(${o})`;
    e.fail$data((0, Bt._)`(${n} === 0 || (${o} = ${r}/${n}, ${u}))`);
  }
};
Tn.default = ll;
var Rn = {}, kn = {};
Object.defineProperty(kn, "__esModule", { value: !0 });
function Fi(e) {
  const t = e.length;
  let r = 0, n = 0, s;
  for (; n < t; )
    r++, s = e.charCodeAt(n++), s >= 55296 && s <= 56319 && n < t && (s = e.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
kn.default = Fi;
Fi.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(Rn, "__esModule", { value: !0 });
const at = B, ul = X, dl = kn, fl = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, at.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, at._)`{limit: ${e}}`
}, pl = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: fl,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: s } = e, i = t === "maxLength" ? at.operators.GT : at.operators.LT, o = s.opts.unicode === !1 ? (0, at._)`${r}.length` : (0, at._)`${(0, ul.useFunc)(e.gen, dl.default)}(${r})`;
    e.fail$data((0, at._)`${o} ${i} ${n}`);
  }
};
Rn.default = pl;
var On = {};
Object.defineProperty(On, "__esModule", { value: !0 });
const hl = H, Tr = B, ml = {
  message: ({ schemaCode: e }) => (0, Tr.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, Tr._)`{pattern: ${e}}`
}, yl = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: ml,
  code(e) {
    const { data: t, $data: r, schema: n, schemaCode: s, it: i } = e, o = i.opts.unicodeRegExp ? "u" : "", u = r ? (0, Tr._)`(new RegExp(${s}, ${o}))` : (0, hl.usePattern)(e, n);
    e.fail$data((0, Tr._)`!${u}.test(${t})`);
  }
};
On.default = yl;
var Cn = {};
Object.defineProperty(Cn, "__esModule", { value: !0 });
const Gt = B, gl = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, Gt.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, Gt._)`{limit: ${e}}`
}, $l = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: gl,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxProperties" ? Gt.operators.GT : Gt.operators.LT;
    e.fail$data((0, Gt._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
Cn.default = $l;
var Nn = {};
Object.defineProperty(Nn, "__esModule", { value: !0 });
const Wt = H, Kt = B, _l = X, wl = {
  message: ({ params: { missingProperty: e } }) => (0, Kt.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, Kt._)`{missingProperty: ${e}}`
}, vl = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: wl,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: s, $data: i, it: o } = e, { opts: u } = o;
    if (!i && r.length === 0)
      return;
    const f = r.length >= u.loopRequired;
    if (o.allErrors ? l() : d(), u.strictRequired) {
      const b = e.parentSchema.properties, { definedProperties: P } = e.it;
      for (const O of r)
        if ((b == null ? void 0 : b[O]) === void 0 && !P.has(O)) {
          const w = o.schemaEnv.baseId + o.errSchemaPath, g = `required property "${O}" is not defined at "${w}" (strictRequired)`;
          (0, _l.checkStrictMode)(o, g, o.opts.strictRequired);
        }
    }
    function l() {
      if (f || i)
        e.block$data(Kt.nil, p);
      else
        for (const b of r)
          (0, Wt.checkReportMissingProp)(e, b);
    }
    function d() {
      const b = t.let("missing");
      if (f || i) {
        const P = t.let("valid", !0);
        e.block$data(P, () => _(b, P)), e.ok(P);
      } else
        t.if((0, Wt.checkMissingProp)(e, r, b)), (0, Wt.reportMissingProp)(e, b), t.else();
    }
    function p() {
      t.forOf("prop", n, (b) => {
        e.setParams({ missingProperty: b }), t.if((0, Wt.noPropertyInData)(t, s, b, u.ownProperties), () => e.error());
      });
    }
    function _(b, P) {
      e.setParams({ missingProperty: b }), t.forOf(b, n, () => {
        t.assign(P, (0, Wt.propertyInData)(t, s, b, u.ownProperties)), t.if((0, Kt.not)(P), () => {
          e.error(), t.break();
        });
      }, Kt.nil);
    }
  }
};
Nn.default = vl;
var In = {};
Object.defineProperty(In, "__esModule", { value: !0 });
const Jt = B, bl = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, Jt.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, Jt._)`{limit: ${e}}`
}, El = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: bl,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxItems" ? Jt.operators.GT : Jt.operators.LT;
    e.fail$data((0, Jt._)`${r}.length ${s} ${n}`);
  }
};
In.default = El;
var jn = {}, tr = {};
Object.defineProperty(tr, "__esModule", { value: !0 });
const qi = _i;
qi.code = 'require("ajv/dist/runtime/equal").default';
tr.default = qi;
Object.defineProperty(jn, "__esModule", { value: !0 });
const Br = Zt, me = B, Pl = X, Sl = tr, Tl = {
  message: ({ params: { i: e, j: t } }) => (0, me.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, me._)`{i: ${e}, j: ${t}}`
}, Rl = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: Tl,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, parentSchema: i, schemaCode: o, it: u } = e;
    if (!n && !s)
      return;
    const f = t.let("valid"), l = i.items ? (0, Br.getSchemaTypes)(i.items) : [];
    e.block$data(f, d, (0, me._)`${o} === false`), e.ok(f);
    function d() {
      const P = t.let("i", (0, me._)`${r}.length`), O = t.let("j");
      e.setParams({ i: P, j: O }), t.assign(f, !0), t.if((0, me._)`${P} > 1`, () => (p() ? _ : b)(P, O));
    }
    function p() {
      return l.length > 0 && !l.some((P) => P === "object" || P === "array");
    }
    function _(P, O) {
      const w = t.name("item"), g = (0, Br.checkDataTypes)(l, w, u.opts.strictNumbers, Br.DataType.Wrong), $ = t.const("indices", (0, me._)`{}`);
      t.for((0, me._)`;${P}--;`, () => {
        t.let(w, (0, me._)`${r}[${P}]`), t.if(g, (0, me._)`continue`), l.length > 1 && t.if((0, me._)`typeof ${w} == "string"`, (0, me._)`${w} += "_"`), t.if((0, me._)`typeof ${$}[${w}] == "number"`, () => {
          t.assign(O, (0, me._)`${$}[${w}]`), e.error(), t.assign(f, !1).break();
        }).code((0, me._)`${$}[${w}] = ${P}`);
      });
    }
    function b(P, O) {
      const w = (0, Pl.useFunc)(t, Sl.default), g = t.name("outer");
      t.label(g).for((0, me._)`;${P}--;`, () => t.for((0, me._)`${O} = ${P}; ${O}--;`, () => t.if((0, me._)`${w}(${r}[${P}], ${r}[${O}])`, () => {
        e.error(), t.assign(f, !1).break(g);
      })));
    }
  }
};
jn.default = Rl;
var An = {};
Object.defineProperty(An, "__esModule", { value: !0 });
const on = B, kl = X, Ol = tr, Cl = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, on._)`{allowedValue: ${e}}`
}, Nl = {
  keyword: "const",
  $data: !0,
  error: Cl,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: s, schema: i } = e;
    n || i && typeof i == "object" ? e.fail$data((0, on._)`!${(0, kl.useFunc)(t, Ol.default)}(${r}, ${s})`) : e.fail((0, on._)`${i} !== ${r}`);
  }
};
An.default = Nl;
var Dn = {};
Object.defineProperty(Dn, "__esModule", { value: !0 });
const xt = B, Il = X, jl = tr, Al = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, xt._)`{allowedValues: ${e}}`
}, Dl = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: Al,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: i, it: o } = e;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const u = s.length >= o.opts.loopEnum;
    let f;
    const l = () => f ?? (f = (0, Il.useFunc)(t, jl.default));
    let d;
    if (u || n)
      d = t.let("valid"), e.block$data(d, p);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const b = t.const("vSchema", i);
      d = (0, xt.or)(...s.map((P, O) => _(b, O)));
    }
    e.pass(d);
    function p() {
      t.assign(d, !1), t.forOf("v", i, (b) => t.if((0, xt._)`${l()}(${r}, ${b})`, () => t.assign(d, !0).break()));
    }
    function _(b, P) {
      const O = s[P];
      return typeof O == "object" && O !== null ? (0, xt._)`${l()}(${r}, ${b}[${P}])` : (0, xt._)`${r} === ${O}`;
    }
  }
};
Dn.default = Dl;
Object.defineProperty(Pn, "__esModule", { value: !0 });
const Ml = Sn, Ll = Tn, Fl = Rn, ql = On, Ul = Cn, zl = Nn, Vl = In, Wl = jn, xl = An, Hl = Dn, Bl = [
  // number
  Ml.default,
  Ll.default,
  // string
  Fl.default,
  ql.default,
  // object
  Ul.default,
  zl.default,
  // array
  Vl.default,
  Wl.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  xl.default,
  Hl.default
];
Pn.default = Bl;
var Mn = {}, Ct = {};
Object.defineProperty(Ct, "__esModule", { value: !0 });
Ct.validateAdditionalItems = void 0;
const ct = B, an = X, Gl = {
  message: ({ params: { len: e } }) => (0, ct.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, ct._)`{limit: ${e}}`
}, Kl = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: Gl,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, an.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    Ui(e, n);
  }
};
function Ui(e, t) {
  const { gen: r, schema: n, data: s, keyword: i, it: o } = e;
  o.items = !0;
  const u = r.const("len", (0, ct._)`${s}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, ct._)`${u} <= ${t.length}`);
  else if (typeof n == "object" && !(0, an.alwaysValidSchema)(o, n)) {
    const l = r.var("valid", (0, ct._)`${u} <= ${t.length}`);
    r.if((0, ct.not)(l), () => f(l)), e.ok(l);
  }
  function f(l) {
    r.forRange("i", t.length, u, (d) => {
      e.subschema({ keyword: i, dataProp: d, dataPropType: an.Type.Num }, l), o.allErrors || r.if((0, ct.not)(l), () => r.break());
    });
  }
}
Ct.validateAdditionalItems = Ui;
Ct.default = Kl;
var Ln = {}, Nt = {};
Object.defineProperty(Nt, "__esModule", { value: !0 });
Nt.validateTuple = void 0;
const Os = B, yr = X, Jl = H, Ql = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return zi(e, "additionalItems", t);
    r.items = !0, !(0, yr.alwaysValidSchema)(r, t) && e.ok((0, Jl.validateArray)(e));
  }
};
function zi(e, t, r = e.schema) {
  const { gen: n, parentSchema: s, data: i, keyword: o, it: u } = e;
  d(s), u.opts.unevaluated && r.length && u.items !== !0 && (u.items = yr.mergeEvaluated.items(n, r.length, u.items));
  const f = n.name("valid"), l = n.const("len", (0, Os._)`${i}.length`);
  r.forEach((p, _) => {
    (0, yr.alwaysValidSchema)(u, p) || (n.if((0, Os._)`${l} > ${_}`, () => e.subschema({
      keyword: o,
      schemaProp: _,
      dataProp: _
    }, f)), e.ok(f));
  });
  function d(p) {
    const { opts: _, errSchemaPath: b } = u, P = r.length, O = P === p.minItems && (P === p.maxItems || p[t] === !1);
    if (_.strictTuples && !O) {
      const w = `"${o}" is ${P}-tuple, but minItems or maxItems/${t} are not specified or different at path "${b}"`;
      (0, yr.checkStrictMode)(u, w, _.strictTuples);
    }
  }
}
Nt.validateTuple = zi;
Nt.default = Ql;
Object.defineProperty(Ln, "__esModule", { value: !0 });
const Yl = Nt, Zl = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, Yl.validateTuple)(e, "items")
};
Ln.default = Zl;
var Fn = {};
Object.defineProperty(Fn, "__esModule", { value: !0 });
const Cs = B, Xl = X, eu = H, tu = Ct, ru = {
  message: ({ params: { len: e } }) => (0, Cs.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Cs._)`{limit: ${e}}`
}, nu = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: ru,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: s } = r;
    n.items = !0, !(0, Xl.alwaysValidSchema)(n, t) && (s ? (0, tu.validateAdditionalItems)(e, s) : e.ok((0, eu.validateArray)(e)));
  }
};
Fn.default = nu;
var qn = {};
Object.defineProperty(qn, "__esModule", { value: !0 });
const Re = B, ar = X, su = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Re.str)`must contain at least ${e} valid item(s)` : (0, Re.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Re._)`{minContains: ${e}}` : (0, Re._)`{minContains: ${e}, maxContains: ${t}}`
}, iu = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: su,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: i } = e;
    let o, u;
    const { minContains: f, maxContains: l } = n;
    i.opts.next ? (o = f === void 0 ? 1 : f, u = l) : o = 1;
    const d = t.const("len", (0, Re._)`${s}.length`);
    if (e.setParams({ min: o, max: u }), u === void 0 && o === 0) {
      (0, ar.checkStrictMode)(i, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (u !== void 0 && o > u) {
      (0, ar.checkStrictMode)(i, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, ar.alwaysValidSchema)(i, r)) {
      let O = (0, Re._)`${d} >= ${o}`;
      u !== void 0 && (O = (0, Re._)`${O} && ${d} <= ${u}`), e.pass(O);
      return;
    }
    i.items = !0;
    const p = t.name("valid");
    u === void 0 && o === 1 ? b(p, () => t.if(p, () => t.break())) : o === 0 ? (t.let(p, !0), u !== void 0 && t.if((0, Re._)`${s}.length > 0`, _)) : (t.let(p, !1), _()), e.result(p, () => e.reset());
    function _() {
      const O = t.name("_valid"), w = t.let("count", 0);
      b(O, () => t.if(O, () => P(w)));
    }
    function b(O, w) {
      t.forRange("i", 0, d, (g) => {
        e.subschema({
          keyword: "contains",
          dataProp: g,
          dataPropType: ar.Type.Num,
          compositeRule: !0
        }, O), w();
      });
    }
    function P(O) {
      t.code((0, Re._)`${O}++`), u === void 0 ? t.if((0, Re._)`${O} >= ${o}`, () => t.assign(p, !0).break()) : (t.if((0, Re._)`${O} > ${u}`, () => t.assign(p, !1).break()), o === 1 ? t.assign(p, !0) : t.if((0, Re._)`${O} >= ${o}`, () => t.assign(p, !0)));
    }
  }
};
qn.default = iu;
var Vi = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = B, r = X, n = H;
  e.error = {
    message: ({ params: { property: f, depsCount: l, deps: d } }) => {
      const p = l === 1 ? "property" : "properties";
      return (0, t.str)`must have ${p} ${d} when property ${f} is present`;
    },
    params: ({ params: { property: f, depsCount: l, deps: d, missingProperty: p } }) => (0, t._)`{property: ${f},
    missingProperty: ${p},
    depsCount: ${l},
    deps: ${d}}`
    // TODO change to reference
  };
  const s = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: e.error,
    code(f) {
      const [l, d] = i(f);
      o(f, l), u(f, d);
    }
  };
  function i({ schema: f }) {
    const l = {}, d = {};
    for (const p in f) {
      if (p === "__proto__")
        continue;
      const _ = Array.isArray(f[p]) ? l : d;
      _[p] = f[p];
    }
    return [l, d];
  }
  function o(f, l = f.schema) {
    const { gen: d, data: p, it: _ } = f;
    if (Object.keys(l).length === 0)
      return;
    const b = d.let("missing");
    for (const P in l) {
      const O = l[P];
      if (O.length === 0)
        continue;
      const w = (0, n.propertyInData)(d, p, P, _.opts.ownProperties);
      f.setParams({
        property: P,
        depsCount: O.length,
        deps: O.join(", ")
      }), _.allErrors ? d.if(w, () => {
        for (const g of O)
          (0, n.checkReportMissingProp)(f, g);
      }) : (d.if((0, t._)`${w} && (${(0, n.checkMissingProp)(f, O, b)})`), (0, n.reportMissingProp)(f, b), d.else());
    }
  }
  e.validatePropertyDeps = o;
  function u(f, l = f.schema) {
    const { gen: d, data: p, keyword: _, it: b } = f, P = d.name("valid");
    for (const O in l)
      (0, r.alwaysValidSchema)(b, l[O]) || (d.if(
        (0, n.propertyInData)(d, p, O, b.opts.ownProperties),
        () => {
          const w = f.subschema({ keyword: _, schemaProp: O }, P);
          f.mergeValidEvaluated(w, P);
        },
        () => d.var(P, !0)
        // TODO var
      ), f.ok(P));
  }
  e.validateSchemaDeps = u, e.default = s;
})(Vi);
var Un = {};
Object.defineProperty(Un, "__esModule", { value: !0 });
const Wi = B, ou = X, au = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, Wi._)`{propertyName: ${e.propertyName}}`
}, cu = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: au,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e;
    if ((0, ou.alwaysValidSchema)(s, r))
      return;
    const i = t.name("valid");
    t.forIn("key", n, (o) => {
      e.setParams({ propertyName: o }), e.subschema({
        keyword: "propertyNames",
        data: o,
        dataTypes: ["string"],
        propertyName: o,
        compositeRule: !0
      }, i), t.if((0, Wi.not)(i), () => {
        e.error(!0), s.allErrors || t.break();
      });
    }), e.ok(i);
  }
};
Un.default = cu;
var Lr = {};
Object.defineProperty(Lr, "__esModule", { value: !0 });
const cr = H, Oe = B, lu = We, lr = X, uu = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, Oe._)`{additionalProperty: ${e.additionalProperty}}`
}, du = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: uu,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, errsCount: i, it: o } = e;
    if (!i)
      throw new Error("ajv implementation error");
    const { allErrors: u, opts: f } = o;
    if (o.props = !0, f.removeAdditional !== "all" && (0, lr.alwaysValidSchema)(o, r))
      return;
    const l = (0, cr.allSchemaProperties)(n.properties), d = (0, cr.allSchemaProperties)(n.patternProperties);
    p(), e.ok((0, Oe._)`${i} === ${lu.default.errors}`);
    function p() {
      t.forIn("key", s, (w) => {
        !l.length && !d.length ? P(w) : t.if(_(w), () => P(w));
      });
    }
    function _(w) {
      let g;
      if (l.length > 8) {
        const $ = (0, lr.schemaRefOrVal)(o, n.properties, "properties");
        g = (0, cr.isOwnProperty)(t, $, w);
      } else
        l.length ? g = (0, Oe.or)(...l.map(($) => (0, Oe._)`${w} === ${$}`)) : g = Oe.nil;
      return d.length && (g = (0, Oe.or)(g, ...d.map(($) => (0, Oe._)`${(0, cr.usePattern)(e, $)}.test(${w})`))), (0, Oe.not)(g);
    }
    function b(w) {
      t.code((0, Oe._)`delete ${s}[${w}]`);
    }
    function P(w) {
      if (f.removeAdditional === "all" || f.removeAdditional && r === !1) {
        b(w);
        return;
      }
      if (r === !1) {
        e.setParams({ additionalProperty: w }), e.error(), u || t.break();
        return;
      }
      if (typeof r == "object" && !(0, lr.alwaysValidSchema)(o, r)) {
        const g = t.name("valid");
        f.removeAdditional === "failing" ? (O(w, g, !1), t.if((0, Oe.not)(g), () => {
          e.reset(), b(w);
        })) : (O(w, g), u || t.if((0, Oe.not)(g), () => t.break()));
      }
    }
    function O(w, g, $) {
      const S = {
        keyword: "additionalProperties",
        dataProp: w,
        dataPropType: lr.Type.Str
      };
      $ === !1 && Object.assign(S, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(S, g);
    }
  }
};
Lr.default = du;
var zn = {};
Object.defineProperty(zn, "__esModule", { value: !0 });
const fu = Ne, Ns = H, Gr = X, Is = Lr, pu = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: i } = e;
    i.opts.removeAdditional === "all" && n.additionalProperties === void 0 && Is.default.code(new fu.KeywordCxt(i, Is.default, "additionalProperties"));
    const o = (0, Ns.allSchemaProperties)(r);
    for (const p of o)
      i.definedProperties.add(p);
    i.opts.unevaluated && o.length && i.props !== !0 && (i.props = Gr.mergeEvaluated.props(t, (0, Gr.toHash)(o), i.props));
    const u = o.filter((p) => !(0, Gr.alwaysValidSchema)(i, r[p]));
    if (u.length === 0)
      return;
    const f = t.name("valid");
    for (const p of u)
      l(p) ? d(p) : (t.if((0, Ns.propertyInData)(t, s, p, i.opts.ownProperties)), d(p), i.allErrors || t.else().var(f, !0), t.endIf()), e.it.definedProperties.add(p), e.ok(f);
    function l(p) {
      return i.opts.useDefaults && !i.compositeRule && r[p].default !== void 0;
    }
    function d(p) {
      e.subschema({
        keyword: "properties",
        schemaProp: p,
        dataProp: p
      }, f);
    }
  }
};
zn.default = pu;
var Vn = {};
Object.defineProperty(Vn, "__esModule", { value: !0 });
const js = H, ur = B, As = X, Ds = X, hu = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: s, it: i } = e, { opts: o } = i, u = (0, js.allSchemaProperties)(r), f = u.filter((O) => (0, As.alwaysValidSchema)(i, r[O]));
    if (u.length === 0 || f.length === u.length && (!i.opts.unevaluated || i.props === !0))
      return;
    const l = o.strictSchema && !o.allowMatchingProperties && s.properties, d = t.name("valid");
    i.props !== !0 && !(i.props instanceof ur.Name) && (i.props = (0, Ds.evaluatedPropsToName)(t, i.props));
    const { props: p } = i;
    _();
    function _() {
      for (const O of u)
        l && b(O), i.allErrors ? P(O) : (t.var(d, !0), P(O), t.if(d));
    }
    function b(O) {
      for (const w in l)
        new RegExp(O).test(w) && (0, As.checkStrictMode)(i, `property ${w} matches pattern ${O} (use allowMatchingProperties)`);
    }
    function P(O) {
      t.forIn("key", n, (w) => {
        t.if((0, ur._)`${(0, js.usePattern)(e, O)}.test(${w})`, () => {
          const g = f.includes(O);
          g || e.subschema({
            keyword: "patternProperties",
            schemaProp: O,
            dataProp: w,
            dataPropType: Ds.Type.Str
          }, d), i.opts.unevaluated && p !== !0 ? t.assign((0, ur._)`${p}[${w}]`, !0) : !g && !i.allErrors && t.if((0, ur.not)(d), () => t.break());
        });
      });
    }
  }
};
Vn.default = hu;
var Wn = {};
Object.defineProperty(Wn, "__esModule", { value: !0 });
const mu = X, yu = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, mu.alwaysValidSchema)(n, r)) {
      e.fail();
      return;
    }
    const s = t.name("valid");
    e.subschema({
      keyword: "not",
      compositeRule: !0,
      createErrors: !1,
      allErrors: !1
    }, s), e.failResult(s, () => e.reset(), () => e.error());
  },
  error: { message: "must NOT be valid" }
};
Wn.default = yu;
var xn = {};
Object.defineProperty(xn, "__esModule", { value: !0 });
const gu = H, $u = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: gu.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
xn.default = $u;
var Hn = {};
Object.defineProperty(Hn, "__esModule", { value: !0 });
const gr = B, _u = X, wu = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, gr._)`{passingSchemas: ${e.passing}}`
}, vu = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: wu,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, it: s } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (s.opts.discriminator && n.discriminator)
      return;
    const i = r, o = t.let("valid", !1), u = t.let("passing", null), f = t.name("_valid");
    e.setParams({ passing: u }), t.block(l), e.result(o, () => e.reset(), () => e.error(!0));
    function l() {
      i.forEach((d, p) => {
        let _;
        (0, _u.alwaysValidSchema)(s, d) ? t.var(f, !0) : _ = e.subschema({
          keyword: "oneOf",
          schemaProp: p,
          compositeRule: !0
        }, f), p > 0 && t.if((0, gr._)`${f} && ${o}`).assign(o, !1).assign(u, (0, gr._)`[${u}, ${p}]`).else(), t.if(f, () => {
          t.assign(o, !0), t.assign(u, p), _ && e.mergeEvaluated(_, gr.Name);
        });
      });
    }
  }
};
Hn.default = vu;
var Bn = {};
Object.defineProperty(Bn, "__esModule", { value: !0 });
const bu = X, Eu = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = t.name("valid");
    r.forEach((i, o) => {
      if ((0, bu.alwaysValidSchema)(n, i))
        return;
      const u = e.subschema({ keyword: "allOf", schemaProp: o }, s);
      e.ok(s), e.mergeEvaluated(u);
    });
  }
};
Bn.default = Eu;
var Gn = {};
Object.defineProperty(Gn, "__esModule", { value: !0 });
const Rr = B, xi = X, Pu = {
  message: ({ params: e }) => (0, Rr.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, Rr._)`{failingKeyword: ${e.ifClause}}`
}, Su = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: Pu,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, xi.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = Ms(n, "then"), i = Ms(n, "else");
    if (!s && !i)
      return;
    const o = t.let("valid", !0), u = t.name("_valid");
    if (f(), e.reset(), s && i) {
      const d = t.let("ifClause");
      e.setParams({ ifClause: d }), t.if(u, l("then", d), l("else", d));
    } else
      s ? t.if(u, l("then")) : t.if((0, Rr.not)(u), l("else"));
    e.pass(o, () => e.error(!0));
    function f() {
      const d = e.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, u);
      e.mergeEvaluated(d);
    }
    function l(d, p) {
      return () => {
        const _ = e.subschema({ keyword: d }, u);
        t.assign(o, u), e.mergeValidEvaluated(_, o), p ? t.assign(p, (0, Rr._)`${d}`) : e.setParams({ ifClause: d });
      };
    }
  }
};
function Ms(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, xi.alwaysValidSchema)(e, r);
}
Gn.default = Su;
var Kn = {};
Object.defineProperty(Kn, "__esModule", { value: !0 });
const Tu = X, Ru = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, Tu.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
Kn.default = Ru;
Object.defineProperty(Mn, "__esModule", { value: !0 });
const ku = Ct, Ou = Ln, Cu = Nt, Nu = Fn, Iu = qn, ju = Vi, Au = Un, Du = Lr, Mu = zn, Lu = Vn, Fu = Wn, qu = xn, Uu = Hn, zu = Bn, Vu = Gn, Wu = Kn;
function xu(e = !1) {
  const t = [
    // any
    Fu.default,
    qu.default,
    Uu.default,
    zu.default,
    Vu.default,
    Wu.default,
    // object
    Au.default,
    Du.default,
    ju.default,
    Mu.default,
    Lu.default
  ];
  return e ? t.push(Ou.default, Nu.default) : t.push(ku.default, Cu.default), t.push(Iu.default), t;
}
Mn.default = xu;
var Jn = {}, Qn = {};
Object.defineProperty(Qn, "__esModule", { value: !0 });
const le = B, Hu = {
  message: ({ schemaCode: e }) => (0, le.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, le._)`{format: ${e}}`
}, Bu = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: Hu,
  code(e, t) {
    const { gen: r, data: n, $data: s, schema: i, schemaCode: o, it: u } = e, { opts: f, errSchemaPath: l, schemaEnv: d, self: p } = u;
    if (!f.validateFormats)
      return;
    s ? _() : b();
    function _() {
      const P = r.scopeValue("formats", {
        ref: p.formats,
        code: f.code.formats
      }), O = r.const("fDef", (0, le._)`${P}[${o}]`), w = r.let("fType"), g = r.let("format");
      r.if((0, le._)`typeof ${O} == "object" && !(${O} instanceof RegExp)`, () => r.assign(w, (0, le._)`${O}.type || "string"`).assign(g, (0, le._)`${O}.validate`), () => r.assign(w, (0, le._)`"string"`).assign(g, O)), e.fail$data((0, le.or)($(), S()));
      function $() {
        return f.strictSchema === !1 ? le.nil : (0, le._)`${o} && !${g}`;
      }
      function S() {
        const I = d.$async ? (0, le._)`(${O}.async ? await ${g}(${n}) : ${g}(${n}))` : (0, le._)`${g}(${n})`, D = (0, le._)`(typeof ${g} == "function" ? ${I} : ${g}.test(${n}))`;
        return (0, le._)`${g} && ${g} !== true && ${w} === ${t} && !${D}`;
      }
    }
    function b() {
      const P = p.formats[i];
      if (!P) {
        $();
        return;
      }
      if (P === !0)
        return;
      const [O, w, g] = S(P);
      O === t && e.pass(I());
      function $() {
        if (f.strictSchema === !1) {
          p.logger.warn(D());
          return;
        }
        throw new Error(D());
        function D() {
          return `unknown format "${i}" ignored in schema at path "${l}"`;
        }
      }
      function S(D) {
        const E = D instanceof RegExp ? (0, le.regexpCode)(D) : f.code.formats ? (0, le._)`${f.code.formats}${(0, le.getProperty)(i)}` : void 0, C = r.scopeValue("formats", { key: i, ref: D, code: E });
        return typeof D == "object" && !(D instanceof RegExp) ? [D.type || "string", D.validate, (0, le._)`${C}.validate`] : ["string", D, C];
      }
      function I() {
        if (typeof P == "object" && !(P instanceof RegExp) && P.async) {
          if (!d.$async)
            throw new Error("async format in sync schema");
          return (0, le._)`await ${g}(${n})`;
        }
        return typeof w == "function" ? (0, le._)`${g}(${n})` : (0, le._)`${g}.test(${n})`;
      }
    }
  }
};
Qn.default = Bu;
Object.defineProperty(Jn, "__esModule", { value: !0 });
const Gu = Qn, Ku = [Gu.default];
Jn.default = Ku;
var Ot = {};
Object.defineProperty(Ot, "__esModule", { value: !0 });
Ot.contentVocabulary = Ot.metadataVocabulary = void 0;
Ot.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
Ot.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(vn, "__esModule", { value: !0 });
const Ju = bn, Qu = Pn, Yu = Mn, Zu = Jn, Ls = Ot, Xu = [
  Ju.default,
  Qu.default,
  (0, Yu.default)(),
  Zu.default,
  Ls.metadataVocabulary,
  Ls.contentVocabulary
];
vn.default = Xu;
var Yn = {}, Hi = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.DiscrError = void 0, function(t) {
    t.Tag = "tag", t.Mapping = "mapping";
  }(e.DiscrError || (e.DiscrError = {}));
})(Hi);
Object.defineProperty(Yn, "__esModule", { value: !0 });
const Pt = B, cn = Hi, Fs = ve, ed = X, td = {
  message: ({ params: { discrError: e, tagName: t } }) => e === cn.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, Pt._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, rd = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: td,
  code(e) {
    const { gen: t, data: r, schema: n, parentSchema: s, it: i } = e, { oneOf: o } = s;
    if (!i.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const u = n.propertyName;
    if (typeof u != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!o)
      throw new Error("discriminator: requires oneOf keyword");
    const f = t.let("valid", !1), l = t.const("tag", (0, Pt._)`${r}${(0, Pt.getProperty)(u)}`);
    t.if((0, Pt._)`typeof ${l} == "string"`, () => d(), () => e.error(!1, { discrError: cn.DiscrError.Tag, tag: l, tagName: u })), e.ok(f);
    function d() {
      const b = _();
      t.if(!1);
      for (const P in b)
        t.elseIf((0, Pt._)`${l} === ${P}`), t.assign(f, p(b[P]));
      t.else(), e.error(!1, { discrError: cn.DiscrError.Mapping, tag: l, tagName: u }), t.endIf();
    }
    function p(b) {
      const P = t.name("valid"), O = e.subschema({ keyword: "oneOf", schemaProp: b }, P);
      return e.mergeEvaluated(O, Pt.Name), P;
    }
    function _() {
      var b;
      const P = {}, O = g(s);
      let w = !0;
      for (let I = 0; I < o.length; I++) {
        let D = o[I];
        D != null && D.$ref && !(0, ed.schemaHasRulesButRef)(D, i.self.RULES) && (D = Fs.resolveRef.call(i.self, i.schemaEnv.root, i.baseId, D == null ? void 0 : D.$ref), D instanceof Fs.SchemaEnv && (D = D.schema));
        const E = (b = D == null ? void 0 : D.properties) === null || b === void 0 ? void 0 : b[u];
        if (typeof E != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${u}"`);
        w = w && (O || g(D)), $(E, I);
      }
      if (!w)
        throw new Error(`discriminator: "${u}" must be required`);
      return P;
      function g({ required: I }) {
        return Array.isArray(I) && I.includes(u);
      }
      function $(I, D) {
        if (I.const)
          S(I.const, D);
        else if (I.enum)
          for (const E of I.enum)
            S(E, D);
        else
          throw new Error(`discriminator: "properties/${u}" must have "const" or "enum"`);
      }
      function S(I, D) {
        if (typeof I != "string" || I in P)
          throw new Error(`discriminator: "${u}" values must be unique strings`);
        P[I] = D;
      }
    }
  }
};
Yn.default = rd;
const nd = "http://json-schema.org/draft-07/schema#", sd = "http://json-schema.org/draft-07/schema#", id = "Core schema meta-schema", od = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $ref: "#"
    }
  },
  nonNegativeInteger: {
    type: "integer",
    minimum: 0
  },
  nonNegativeIntegerDefault0: {
    allOf: [
      {
        $ref: "#/definitions/nonNegativeInteger"
      },
      {
        default: 0
      }
    ]
  },
  simpleTypes: {
    enum: [
      "array",
      "boolean",
      "integer",
      "null",
      "number",
      "object",
      "string"
    ]
  },
  stringArray: {
    type: "array",
    items: {
      type: "string"
    },
    uniqueItems: !0,
    default: []
  }
}, ad = [
  "object",
  "boolean"
], cd = {
  $id: {
    type: "string",
    format: "uri-reference"
  },
  $schema: {
    type: "string",
    format: "uri"
  },
  $ref: {
    type: "string",
    format: "uri-reference"
  },
  $comment: {
    type: "string"
  },
  title: {
    type: "string"
  },
  description: {
    type: "string"
  },
  default: !0,
  readOnly: {
    type: "boolean",
    default: !1
  },
  examples: {
    type: "array",
    items: !0
  },
  multipleOf: {
    type: "number",
    exclusiveMinimum: 0
  },
  maximum: {
    type: "number"
  },
  exclusiveMaximum: {
    type: "number"
  },
  minimum: {
    type: "number"
  },
  exclusiveMinimum: {
    type: "number"
  },
  maxLength: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minLength: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  pattern: {
    type: "string",
    format: "regex"
  },
  additionalItems: {
    $ref: "#"
  },
  items: {
    anyOf: [
      {
        $ref: "#"
      },
      {
        $ref: "#/definitions/schemaArray"
      }
    ],
    default: !0
  },
  maxItems: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minItems: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  uniqueItems: {
    type: "boolean",
    default: !1
  },
  contains: {
    $ref: "#"
  },
  maxProperties: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minProperties: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  required: {
    $ref: "#/definitions/stringArray"
  },
  additionalProperties: {
    $ref: "#"
  },
  definitions: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    default: {}
  },
  properties: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    default: {}
  },
  patternProperties: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    propertyNames: {
      format: "regex"
    },
    default: {}
  },
  dependencies: {
    type: "object",
    additionalProperties: {
      anyOf: [
        {
          $ref: "#"
        },
        {
          $ref: "#/definitions/stringArray"
        }
      ]
    }
  },
  propertyNames: {
    $ref: "#"
  },
  const: !0,
  enum: {
    type: "array",
    items: !0,
    minItems: 1,
    uniqueItems: !0
  },
  type: {
    anyOf: [
      {
        $ref: "#/definitions/simpleTypes"
      },
      {
        type: "array",
        items: {
          $ref: "#/definitions/simpleTypes"
        },
        minItems: 1,
        uniqueItems: !0
      }
    ]
  },
  format: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentEncoding: {
    type: "string"
  },
  if: {
    $ref: "#"
  },
  then: {
    $ref: "#"
  },
  else: {
    $ref: "#"
  },
  allOf: {
    $ref: "#/definitions/schemaArray"
  },
  anyOf: {
    $ref: "#/definitions/schemaArray"
  },
  oneOf: {
    $ref: "#/definitions/schemaArray"
  },
  not: {
    $ref: "#"
  }
}, ld = {
  $schema: nd,
  $id: sd,
  title: id,
  definitions: od,
  type: ad,
  properties: cd,
  default: !0
};
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = void 0;
  const r = di, n = vn, s = Yn, i = ld, o = ["/properties"], u = "http://json-schema.org/draft-07/schema";
  class f extends r.default {
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach((P) => this.addVocabulary(P)), this.opts.discriminator && this.addKeyword(s.default);
    }
    _addDefaultMetaSchema() {
      if (super._addDefaultMetaSchema(), !this.opts.meta)
        return;
      const P = this.opts.$data ? this.$dataMetaSchema(i, o) : i;
      this.addMetaSchema(P, u, !1), this.refs["http://json-schema.org/schema"] = u;
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(u) ? u : void 0);
    }
  }
  e.exports = t = f, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = f;
  var l = Ne;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return l.KeywordCxt;
  } });
  var d = B;
  Object.defineProperty(t, "_", { enumerable: !0, get: function() {
    return d._;
  } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
    return d.str;
  } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
    return d.stringify;
  } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
    return d.nil;
  } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
    return d.Name;
  } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
    return d.CodeGen;
  } });
  var p = Xt;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return p.default;
  } });
  var _ = er;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return _.default;
  } });
})(tn, tn.exports);
var ud = tn.exports;
const dd = /* @__PURE__ */ ca(ud), fd = "http://json-schema.org/schema", pd = "#/definitions/Blueprint", hd = {
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
          "step",
          "themeSlug"
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
}, md = {
  $schema: fd,
  $ref: pd,
  definitions: hd
}, { wpCLI: yd, ...qs } = ea, gd = {
  ...qs,
  "wp-cli": yd,
  importFile: qs.importWxr
};
function $d(e, {
  progress: t = new jr(),
  semaphore: r = new ho({ concurrency: 3 }),
  onStepCompleted: n = () => {
  }
} = {}) {
  var p, _, b, P, O, w, g;
  e = {
    ...e,
    steps: (e.steps || []).filter(Ed).filter(Pd)
  };
  for (const $ of e.steps)
    typeof $ == "object" && $.step === "importFile" && ($.step = "importWxr", he.warn(
      'The "importFile" step is deprecated. Use "importWxr" instead.'
    ));
  if (e.constants && e.steps.unshift({
    step: "defineWpConfigConsts",
    consts: e.constants
  }), e.siteOptions && e.steps.unshift({
    step: "setSiteOptions",
    options: e.siteOptions
  }), e.plugins) {
    const $ = e.plugins.map((S) => typeof S == "string" ? S.startsWith("https://") ? {
      resource: "url",
      url: S
    } : {
      resource: "wordpress.org/plugins",
      slug: S
    } : S).map((S) => ({
      step: "installPlugin",
      pluginZipFile: S
    }));
    e.steps.unshift(...$);
  }
  e.login && e.steps.push({
    step: "login",
    ...e.login === !0 ? { username: "admin", password: "password" } : e.login
  }), e.phpExtensionBundles || (e.phpExtensionBundles = []), e.phpExtensionBundles || (e.phpExtensionBundles = []), e.phpExtensionBundles.length === 0 && e.phpExtensionBundles.push("kitchen-sink");
  const s = (p = e.steps) == null ? void 0 : p.findIndex(
    ($) => typeof $ == "object" && ($ == null ? void 0 : $.step) === "wp-cli"
  );
  s !== void 0 && s > -1 && (e.phpExtensionBundles.includes("light") && (e.phpExtensionBundles = e.phpExtensionBundles.filter(
    ($) => $ !== "light"
  ), he.warn(
    "The wpCli step used in your Blueprint requires the iconv and mbstring PHP extensions. However, you did not specify the kitchen-sink extension bundle. Playground will override your choice and load the kitchen-sink PHP extensions bundle to prevent the WP-CLI step from failing. "
  )), (_ = e.steps) == null || _.splice(s, 0, {
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
  const i = (b = e.steps) == null ? void 0 : b.findIndex(
    ($) => typeof $ == "object" && ($ == null ? void 0 : $.step) === "importWxr"
  );
  i !== void 0 && i > -1 && (e.phpExtensionBundles.includes("light") && (e.phpExtensionBundles = e.phpExtensionBundles.filter(
    ($) => $ !== "light"
  ), he.warn(
    "The importWxr step used in your Blueprint requires the iconv and mbstring PHP extensions. However, you did not specify the kitchen-sink extension bundle. Playground will override your choice and load the kitchen-sink PHP extensions bundle to prevent the WP-CLI step from failing. "
  )), (P = e.steps) == null || P.splice(i, 0, {
    step: "installPlugin",
    pluginZipFile: {
      resource: "url",
      url: "https://playground.wordpress.net/wordpress-importer.zip",
      caption: "Downloading the WordPress Importer plugin"
    }
  }));
  const { valid: o, errors: u } = wd(e);
  if (!o) {
    const $ = new Error(
      `Invalid blueprint: ${u[0].message} at ${u[0].instancePath}`
    );
    throw $.errors = u, $;
  }
  const f = e.steps || [], l = f.reduce(
    ($, S) => {
      var I;
      return $ + (((I = S.progress) == null ? void 0 : I.weight) || 1);
    },
    0
  ), d = f.map(
    ($) => Sd($, {
      semaphore: r,
      rootProgressTracker: t,
      totalProgressWeight: l
    })
  );
  return {
    versions: {
      php: vd(
        (O = e.preferredVersions) == null ? void 0 : O.php,
        fn,
        la
      ),
      wp: ((w = e.preferredVersions) == null ? void 0 : w.wp) || "latest"
    },
    phpExtensions: bd(
      [],
      e.phpExtensionBundles || []
    ),
    features: {
      // Disable networking by default
      networking: ((g = e.features) == null ? void 0 : g.networking) ?? !1
    },
    run: async ($) => {
      try {
        for (const { resources: S } of d)
          for (const I of S)
            I.setPlayground($), I.isAsync && I.resolve();
        for (const [S, { run: I, step: D }] of Object.entries(d))
          try {
            const E = await I($);
            n(E, D);
          } catch (E) {
            throw he.error(E), new Error(
              `Error when executing the blueprint step #${S} (${JSON.stringify(
                D
              )}) ${E instanceof Error ? `: ${E.message}` : E}`,
              { cause: E }
            );
          }
      } finally {
        try {
          await $.goTo(
            e.landingPage || "/"
          );
        } catch {
        }
        t.finish();
      }
    }
  };
}
const _d = new dd({ discriminator: !0 });
let dr;
function wd(e) {
  var s;
  dr = _d.compile(md);
  const t = dr(e);
  if (t)
    return { valid: t };
  const r = /* @__PURE__ */ new Set();
  for (const i of dr.errors)
    i.schemaPath.startsWith("#/properties/steps/items/anyOf") || r.add(i.instancePath);
  const n = (s = dr.errors) == null ? void 0 : s.filter(
    (i) => !(i.schemaPath.startsWith("#/properties/steps/items/anyOf") && r.has(i.instancePath))
  );
  return {
    valid: t,
    errors: n
  };
}
function vd(e, t, r) {
  return e && t.includes(e) ? e : r;
}
function bd(e, t) {
  const r = ci.filter(
    (s) => e.includes(s)
  ), n = t.flatMap(
    (s) => s in _s ? _s[s] : []
  );
  return Array.from(/* @__PURE__ */ new Set([...r, ...n]));
}
function Ed(e) {
  return !!(typeof e == "object" && e);
}
function Pd(e) {
  return ["setPhpIniEntry", "request"].includes(e.step) ? (he.warn(
    `The "${e.step}" Blueprint is no longer supported and you can remove it from your Blueprint.`
  ), !1) : !0;
}
function Sd(e, {
  semaphore: t,
  rootProgressTracker: r,
  totalProgressWeight: n
}) {
  var d;
  const s = r.stage(
    (((d = e.progress) == null ? void 0 : d.weight) || 1) / n
  ), i = {};
  for (const p of Object.keys(e)) {
    let _ = e[p];
    da(_) && (_ = ft.create(_, {
      semaphore: t
    })), i[p] = _;
  }
  const o = async (p) => {
    var _;
    try {
      return s.fillSlowly(), await gd[e.step](
        p,
        await Td(i),
        {
          tracker: s,
          initialCaption: (_ = e.progress) == null ? void 0 : _.caption
        }
      );
    } finally {
      s.finish();
    }
  }, u = Us(i), f = Us(i).filter(
    (p) => p.isAsync
  ), l = 1 / (f.length + 1);
  for (const p of f)
    p.progress = s.stage(l);
  return { run: o, step: e, resources: u };
}
function Us(e) {
  const t = [];
  for (const r in e) {
    const n = e[r];
    n instanceof ft && t.push(n);
  }
  return t;
}
async function Td(e) {
  const t = {};
  for (const r in e) {
    const n = e[r];
    n instanceof ft ? t[r] = await n.resolve() : t[r] = n;
  }
  return t;
}
async function Rd(e, t) {
  await e.run(t);
}
function Gd() {
}
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const Bi = Symbol("Comlink.proxy"), kd = Symbol("Comlink.endpoint"), Od = Symbol("Comlink.releaseProxy"), Kr = Symbol("Comlink.finalizer"), $r = Symbol("Comlink.thrown"), Gi = (e) => typeof e == "object" && e !== null || typeof e == "function", Cd = {
  canHandle: (e) => Gi(e) && e[Bi],
  serialize(e) {
    const { port1: t, port2: r } = new MessageChannel();
    return Zn(e, t), [r, [r]];
  },
  deserialize(e) {
    return e.start(), Xn(e);
  }
}, Nd = {
  canHandle: (e) => Gi(e) && $r in e,
  serialize({ value: e }) {
    let t;
    return e instanceof Error ? t = {
      isError: !0,
      value: {
        message: e.message,
        name: e.name,
        stack: e.stack
      }
    } : t = { isError: !1, value: e }, [t, []];
  },
  deserialize(e) {
    throw e.isError ? Object.assign(new Error(e.value.message), e.value) : e.value;
  }
}, Tt = /* @__PURE__ */ new Map([
  ["proxy", Cd],
  ["throw", Nd]
]);
function Id(e, t) {
  for (const r of e)
    if (t === r || r === "*" || r instanceof RegExp && r.test(t))
      return !0;
  return !1;
}
function Zn(e, t = globalThis, r = ["*"]) {
  t.addEventListener("message", function n(s) {
    if (!s || !s.data)
      return;
    if (!Id(r, s.origin)) {
      console.warn(`Invalid origin '${s.origin}' for comlink proxy`);
      return;
    }
    const { id: i, type: o, path: u } = Object.assign({ path: [] }, s.data), f = (s.data.argumentList || []).map(lt);
    let l;
    try {
      const d = u.slice(0, -1).reduce((_, b) => _[b], e), p = u.reduce((_, b) => _[b], e);
      switch (o) {
        case "GET":
          l = p;
          break;
        case "SET":
          d[u.slice(-1)[0]] = lt(s.data.value), l = !0;
          break;
        case "APPLY":
          l = p.apply(d, f);
          break;
        case "CONSTRUCT":
          {
            const _ = new p(...f);
            l = Yi(_);
          }
          break;
        case "ENDPOINT":
          {
            const { port1: _, port2: b } = new MessageChannel();
            Zn(e, b), l = Ld(_, [_]);
          }
          break;
        case "RELEASE":
          l = void 0;
          break;
        default:
          return;
      }
    } catch (d) {
      l = { value: d, [$r]: 0 };
    }
    Promise.resolve(l).catch((d) => ({ value: d, [$r]: 0 })).then((d) => {
      const [p, _] = Cr(d);
      t.postMessage(Object.assign(Object.assign({}, p), { id: i }), _), o === "RELEASE" && (t.removeEventListener("message", n), Ki(t), Kr in e && typeof e[Kr] == "function" && e[Kr]());
    }).catch((d) => {
      const [p, _] = Cr({
        value: new TypeError("Unserializable return value"),
        [$r]: 0
      });
      t.postMessage(Object.assign(Object.assign({}, p), { id: i }), _);
    });
  }), t.start && t.start();
}
function jd(e) {
  return e.constructor.name === "MessagePort";
}
function Ki(e) {
  jd(e) && e.close();
}
function Xn(e, t) {
  return ln(e, [], t);
}
function fr(e) {
  if (e)
    throw new Error("Proxy has been released and is not useable");
}
function Ji(e) {
  return St(e, {
    type: "RELEASE"
  }).then(() => {
    Ki(e);
  });
}
const kr = /* @__PURE__ */ new WeakMap(), Or = "FinalizationRegistry" in globalThis && new FinalizationRegistry((e) => {
  const t = (kr.get(e) || 0) - 1;
  kr.set(e, t), t === 0 && Ji(e);
});
function Ad(e, t) {
  const r = (kr.get(t) || 0) + 1;
  kr.set(t, r), Or && Or.register(e, t, e);
}
function Dd(e) {
  Or && Or.unregister(e);
}
function ln(e, t = [], r = function() {
}) {
  let n = !1;
  const s = new Proxy(r, {
    get(i, o) {
      if (fr(n), o === Od)
        return () => {
          Dd(s), Ji(e), n = !0;
        };
      if (o === "then") {
        if (t.length === 0)
          return { then: () => s };
        const u = St(e, {
          type: "GET",
          path: t.map((f) => f.toString())
        }).then(lt);
        return u.then.bind(u);
      }
      return ln(e, [...t, o]);
    },
    set(i, o, u) {
      fr(n);
      const [f, l] = Cr(u);
      return St(e, {
        type: "SET",
        path: [...t, o].map((d) => d.toString()),
        value: f
      }, l).then(lt);
    },
    apply(i, o, u) {
      fr(n);
      const f = t[t.length - 1];
      if (f === kd)
        return St(e, {
          type: "ENDPOINT"
        }).then(lt);
      if (f === "bind")
        return ln(e, t.slice(0, -1));
      const [l, d] = zs(u);
      return St(e, {
        type: "APPLY",
        path: t.map((p) => p.toString()),
        argumentList: l
      }, d).then(lt);
    },
    construct(i, o) {
      fr(n);
      const [u, f] = zs(o);
      return St(e, {
        type: "CONSTRUCT",
        path: t.map((l) => l.toString()),
        argumentList: u
      }, f).then(lt);
    }
  });
  return Ad(s, e), s;
}
function Md(e) {
  return Array.prototype.concat.apply([], e);
}
function zs(e) {
  const t = e.map(Cr);
  return [t.map((r) => r[0]), Md(t.map((r) => r[1]))];
}
const Qi = /* @__PURE__ */ new WeakMap();
function Ld(e, t) {
  return Qi.set(e, t), e;
}
function Yi(e) {
  return Object.assign(e, { [Bi]: !0 });
}
function Fd(e, t = globalThis, r = "*") {
  return {
    postMessage: (n, s) => e.postMessage(n, r, s),
    addEventListener: t.addEventListener.bind(t),
    removeEventListener: t.removeEventListener.bind(t)
  };
}
function Cr(e) {
  for (const [t, r] of Tt)
    if (r.canHandle(e)) {
      const [n, s] = r.serialize(e);
      return [
        {
          type: "HANDLER",
          name: t,
          value: n
        },
        s
      ];
    }
  return [
    {
      type: "RAW",
      value: e
    },
    Qi.get(e) || []
  ];
}
function lt(e) {
  switch (e.type) {
    case "HANDLER":
      return Tt.get(e.name).deserialize(e.value);
    case "RAW":
      return e.value;
  }
}
function St(e, t, r) {
  return new Promise((n) => {
    const s = qd();
    e.addEventListener("message", function i(o) {
      !o.data || !o.data.id || o.data.id !== s || (e.removeEventListener("message", i), n(o.data));
    }), e.start && e.start(), e.postMessage(Object.assign({ id: s }, t), r);
  });
}
function qd() {
  return new Array(4).fill(0).map(() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16)).join("-");
}
function Zi(e, t = void 0) {
  zd();
  const r = e instanceof Worker ? e : Fd(e, t), n = Xn(r), s = Xi(n);
  return new Proxy(s, {
    get: (i, o) => o === "isConnected" ? async () => {
      for (; ; )
        try {
          await Ud(n.isConnected(), 200);
          break;
        } catch {
        }
    } : n[o]
  });
}
async function Ud(e, t) {
  return new Promise((r, n) => {
    setTimeout(n, t), e.then(r);
  });
}
let Vs = !1;
function zd() {
  if (Vs)
    return;
  Vs = !0, Tt.set("EVENT", {
    canHandle: (r) => r instanceof CustomEvent,
    serialize: (r) => [
      {
        detail: r.detail
      },
      []
    ],
    deserialize: (r) => r
  }), Tt.set("FUNCTION", {
    canHandle: (r) => typeof r == "function",
    serialize(r) {
      const { port1: n, port2: s } = new MessageChannel();
      return Zn(r, n), [s, [s]];
    },
    deserialize(r) {
      return r.start(), Xn(r);
    }
  }), Tt.set("PHPResponse", {
    canHandle: (r) => typeof r == "object" && r !== null && "headers" in r && "bytes" in r && "errors" in r && "exitCode" in r && "httpStatusCode" in r,
    serialize(r) {
      return [r.toRawData(), []];
    },
    deserialize(r) {
      return br.fromRawData(r);
    }
  });
  const e = Tt.get("throw"), t = e == null ? void 0 : e.serialize;
  e.serialize = ({ value: r }) => {
    const n = t({ value: r });
    return r.response && (n[0].value.response = r.response), r.source && (n[0].value.source = r.source), n;
  };
}
function Xi(e) {
  return new Proxy(e, {
    get(t, r) {
      switch (typeof t[r]) {
        case "function":
          return (...n) => t[r](...n);
        case "object":
          return t[r] === null ? t[r] : Xi(t[r]);
        case "undefined":
        case "number":
        case "string":
          return t[r];
        default:
          return Yi(t[r]);
      }
    }
  });
}
new Promise((e) => {
});
async function Vd({
  iframe: e,
  blueprint: t,
  remoteUrl: r,
  progressTracker: n = new jr(),
  disableProgressBar: s,
  onBlueprintStepCompleted: i,
  onClientConnected: o = () => {
  },
  sapiName: u,
  onBeforeBlueprint: f,
  siteSlug: l
}) {
  if (xd(r), Wd(e), r = Jr(r, {
    progressbar: !s
  }), n.setCaption("Preparing WordPress"), !t) {
    const _ = await Ws(
      e,
      Jr(r, {
        "php-extension": "kitchen-sink",
        "site-slug": l
      }),
      n
    );
    return o(_), _;
  }
  const d = $d(t, {
    progress: n.stage(0.5),
    onStepCompleted: i
  }), p = await Ws(
    e,
    Jr(r, {
      php: d.versions.php,
      wp: d.versions.wp,
      "sapi-name": u,
      "php-extension": d.phpExtensions,
      networking: d.features.networking ? "yes" : "no",
      "site-slug": l
    }),
    n
  );
  return To(he, p), o(p), f && await f(), await Rd(d, p), n.finish(), p;
}
function Wd(e) {
  var t, r;
  (t = e.sandbox) != null && t.length && !((r = e.sandbox) != null && r.contains("allow-storage-access-by-user-activation")) && e.sandbox.add("allow-storage-access-by-user-activation");
}
async function Ws(e, t, r) {
  await new Promise((i) => {
    e.src = t, e.addEventListener("load", i, !1);
  });
  const n = Zi(
    e.contentWindow,
    e.ownerDocument.defaultView
  );
  await n.isConnected(), r.pipe(n);
  const s = r.stage();
  return await n.onDownloadProgress(s.loadingListener), await n.isReady(), s.finish(), n;
}
const _r = "https://playground.wordpress.net";
function xd(e) {
  const t = new URL(e, _r);
  if ((t.origin === _r || t.hostname === "localhost") && t.pathname !== "/remote.html")
    throw new Error(
      `Invalid remote URL: ${t}. Expected origin to be ${_r}/remote.html.`
    );
}
function Jr(e, t) {
  const r = new URL(e, _r), n = new URLSearchParams(r.search);
  for (const [s, i] of Object.entries(t))
    if (i != null && i !== !1)
      if (Array.isArray(i))
        for (const o of i)
          n.append(s, o.toString());
      else
        n.set(s, i.toString());
  return r.search = n.toString(), r.toString();
}
async function Kd(e, t) {
  if (he.warn(
    "`connectPlayground` is deprecated and will be removed. Use `startPlayground` instead."
  ), t != null && t.loadRemote)
    return Vd({
      iframe: e,
      remoteUrl: t.loadRemote
    });
  const r = Zi(
    e.contentWindow,
    e.ownerDocument.defaultView
  );
  return await r.isConnected(), r;
}
export {
  la as LatestSupportedPHPVersion,
  fn as SupportedPHPVersions,
  Bd as SupportedPHPVersionsList,
  un as activatePlugin,
  Ys as activateTheme,
  $d as compileBlueprint,
  Kd as connectPlayground,
  Lo as cp,
  ri as defineSiteUrl,
  wr as defineWpConfigConsts,
  Do as enableMultisite,
  Wo as exportWXR,
  ni as importThemeStarterContent,
  Vo as importWordPressFiles,
  zo as importWxr,
  xo as installPlugin,
  Ho as installTheme,
  Xr as login,
  qo as mkdir,
  Fo as mv,
  de as phpVar,
  Nr as phpVars,
  Zr as request,
  Bo as resetData,
  Zs as rm,
  Uo as rmdir,
  Rd as runBlueprintSteps,
  Ro as runPHP,
  ko as runPHPWithOptions,
  Oo as runSql,
  Go as runWpInstallationWizard,
  Hd as setPhpIniEntries,
  Gd as setPluginProxyURL,
  Xo as setSiteLanguage,
  Xs as setSiteOptions,
  Vd as startPlaygroundWeb,
  dn as unzip,
  jo as updateUserMeta,
  Yo as wpCLI,
  Hs as wpContentFilesExcludedFromExport,
  ti as writeFile,
  Ko as zipWpContent
};
