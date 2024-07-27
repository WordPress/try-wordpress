const Gr = function() {
  var r;
  return typeof process < "u" && ((r = process.release) == null ? void 0 : r.name) === "node" ? "NODE" : typeof window < "u" ? "WEB" : (
    // @ts-ignore
    typeof WorkerGlobalScope < "u" && // @ts-ignore
    self instanceof WorkerGlobalScope ? "WORKER" : "NODE"
  );
}();
if (Gr === "NODE") {
  let r = function(n) {
    return new Promise(function(p, l) {
      n.onload = n.onerror = function(i) {
        n.onload = n.onerror = null, i.type === "load" ? p(n.result) : l(new Error("Failed to read the blob/file"));
      };
    });
  }, t = function() {
    const n = new Uint8Array([1, 2, 3, 4]), l = new File([n], "test").stream();
    try {
      return l.getReader({ mode: "byob" }), !0;
    } catch {
      return !1;
    }
  };
  if (typeof File > "u") {
    class n extends Blob {
      constructor(l, i, e) {
        super(l);
        let u;
        e != null && e.lastModified && (u = /* @__PURE__ */ new Date()), (!u || isNaN(u.getFullYear())) && (u = /* @__PURE__ */ new Date()), this.lastModifiedDate = u, this.lastModified = u.getMilliseconds(), this.name = i || "";
      }
    }
    global.File = n;
  }
  typeof Blob.prototype.arrayBuffer > "u" && (Blob.prototype.arrayBuffer = function() {
    const p = new FileReader();
    return p.readAsArrayBuffer(this), r(p);
  }), typeof Blob.prototype.text > "u" && (Blob.prototype.text = function() {
    const p = new FileReader();
    return p.readAsText(this), r(p);
  }), (typeof Blob.prototype.stream > "u" || !t()) && (Blob.prototype.stream = function() {
    let n = 0;
    const p = this;
    return new ReadableStream({
      type: "bytes",
      // 0.5 MB seems like a reasonable chunk size, let's adjust
      // this if needed.
      autoAllocateChunkSize: 512 * 1024,
      async pull(l) {
        const i = l.byobRequest.view, u = await p.slice(
          n,
          n + i.byteLength
        ).arrayBuffer(), h = new Uint8Array(u);
        new Uint8Array(i.buffer).set(h);
        const b = h.byteLength;
        l.byobRequest.respond(b), n += b, n >= p.size && l.close();
      }
    });
  });
}
if (Gr === "NODE" && typeof CustomEvent > "u") {
  class r extends Event {
    constructor(n, p = {}) {
      super(n, p), this.detail = p.detail;
    }
    initCustomEvent() {
    }
  }
  globalThis.CustomEvent = r;
}
const Yr = [
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
], Zr = Symbol("SleepFinished");
function Et(r) {
  return new Promise((t) => {
    setTimeout(() => t(Zr), r);
  });
}
class $t extends Error {
  constructor() {
    super("Acquiring lock timed out");
  }
}
class Tt {
  constructor({ concurrency: t, timeout: n }) {
    this._running = 0, this.concurrency = t, this.timeout = n, this.queue = [];
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
        const t = new Promise((n) => {
          this.queue.push(n);
        });
        this.timeout !== void 0 ? await Promise.race([t, Et(this.timeout)]).then(
          (n) => {
            if (n === Zr)
              throw new $t();
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
    const n = await this.acquire();
    try {
      return await t();
    } finally {
      n();
    }
  }
}
function se(...r) {
  function t(i) {
    return i.substring(i.length - 1) === "/";
  }
  let n = r.join("/");
  const p = n[0] === "/", l = t(n);
  return n = Jr(n), !n && !p && (n = "."), n && l && !t(n) && (n += "/"), n;
}
function Qr(r) {
  if (r === "/")
    return "/";
  r = Jr(r);
  const t = r.lastIndexOf("/");
  return t === -1 ? "" : t === 0 ? "/" : r.substr(0, t);
}
function Jr(r) {
  const t = r[0] === "/";
  return r = jt(
    r.split("/").filter((n) => !!n),
    !t
  ).join("/"), (t ? "/" : "") + r.replace(/\/$/, "");
}
function jt(r, t) {
  let n = 0;
  for (let p = r.length - 1; p >= 0; p--) {
    const l = r[p];
    l === "." ? r.splice(p, 1) : l === ".." ? (r.splice(p, 1), n++) : n && (r.splice(p, 1), n--);
  }
  if (t)
    for (; n; n--)
      r.unshift("..");
  return r;
}
function Kr(r = 36, t = "!@#$%^&*()_+=-[]/.,<>?") {
  const n = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" + t;
  let p = "";
  for (let l = r; l > 0; --l)
    p += n[Math.floor(Math.random() * n.length)];
  return p;
}
function At() {
  return Kr(36, "-_");
}
function ie(r) {
  return `json_decode(base64_decode('${qt(
    JSON.stringify(r)
  )}'), true)`;
}
function lr(r) {
  const t = {};
  for (const n in r)
    t[n] = ie(r[n]);
  return t;
}
function qt(r) {
  return Rt(new TextEncoder().encode(r));
}
function Rt(r) {
  const t = String.fromCodePoint(...r);
  return btoa(t);
}
const St = "playground-log", xr = (r, ...t) => {
  ae.dispatchEvent(
    new CustomEvent(St, {
      detail: {
        log: r,
        args: t
      }
    })
  );
}, Lt = (r, ...t) => {
  switch (typeof r.message == "string" ? r.message = _r(r.message) : r.message.message && typeof r.message.message == "string" && (r.message.message = _r(r.message.message)), r.severity) {
    case "Debug":
      console.debug(r.message, ...t);
      break;
    case "Info":
      console.info(r.message, ...t);
      break;
    case "Warn":
      console.warn(r.message, ...t);
      break;
    case "Error":
      console.error(r.message, ...t);
      break;
    case "Fatal":
      console.error(r.message, ...t);
      break;
    default:
      console.log(r.message, ...t);
  }
}, xt = (r) => r instanceof Error ? [r.message, r.stack].join(`
`) : JSON.stringify(r, null, 2), Xr = [], Nr = (r) => {
  Xr.push(r);
}, Pr = (r) => {
  if (r.raw === !0)
    Nr(r.message);
  else {
    const t = Ct(
      typeof r.message == "object" ? xt(r.message) : r.message,
      r.severity ?? "Info",
      r.prefix ?? "JavaScript"
    );
    Nr(t);
  }
};
class Nt extends EventTarget {
  // constructor
  constructor(t = []) {
    super(), this.handlers = t, this.fatalErrorEvent = "playground-fatal-error";
  }
  /**
   * Get all logs.
   * @returns string[]
   */
  getLogs() {
    return this.handlers.includes(Pr) ? [...Xr] : (this.error(`Logs aren't stored because the logToMemory handler isn't registered.
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
  logMessage(t, ...n) {
    for (const p of this.handlers)
      p(t, ...n);
  }
  /**
   * Log message
   *
   * @param message any
   * @param args any
   */
  log(t, ...n) {
    this.logMessage(
      {
        message: t,
        severity: void 0,
        prefix: "JavaScript",
        raw: !1
      },
      ...n
    );
  }
  /**
   * Log debug message
   *
   * @param message any
   * @param args any
   */
  debug(t, ...n) {
    this.logMessage(
      {
        message: t,
        severity: "Debug",
        prefix: "JavaScript",
        raw: !1
      },
      ...n
    );
  }
  /**
   * Log info message
   *
   * @param message any
   * @param args any
   */
  info(t, ...n) {
    this.logMessage(
      {
        message: t,
        severity: "Info",
        prefix: "JavaScript",
        raw: !1
      },
      ...n
    );
  }
  /**
   * Log warning message
   *
   * @param message any
   * @param args any
   */
  warn(t, ...n) {
    this.logMessage(
      {
        message: t,
        severity: "Warn",
        prefix: "JavaScript",
        raw: !1
      },
      ...n
    );
  }
  /**
   * Log error message
   *
   * @param message any
   * @param args any
   */
  error(t, ...n) {
    this.logMessage(
      {
        message: t,
        severity: "Error",
        prefix: "JavaScript",
        raw: !1
      },
      ...n
    );
  }
}
const Ft = () => {
  try {
    if (process.env.NODE_ENV === "test")
      return [Pr, xr];
  } catch {
  }
  return [Pr, Lt, xr];
}, ae = new Nt(Ft()), _r = (r) => r.replace(/\t/g, ""), Ct = (r, t, n) => {
  const p = /* @__PURE__ */ new Date(), l = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone: "UTC"
  }).format(p).replace(/ /g, "-"), i = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: !1,
    timeZone: "UTC",
    timeZoneName: "short"
  }).format(p), e = l + " " + i;
  return r = _r(r), `[${e}] ${n} ${t}: ${r}`;
};
let mr = 0;
const Fr = "/wordpress/wp-content/debug.log", It = async (r) => await r.fileExists(Fr) ? await r.readFileAsText(Fr) : "", Dt = (r, t) => {
  t.addEventListener("request.end", async () => {
    const n = await It(t);
    if (n.length > mr) {
      const p = n.substring(mr);
      r.logMessage({
        message: p,
        raw: !0
      }), mr = n.length;
    }
  }), t.addEventListener("request.error", (n) => {
    n = n, n.error && (r.logMessage({
      message: `${n.error.message} ${n.error.stack}`,
      severity: "Fatal",
      prefix: n.source === "request" ? "PHP" : "WASM Crash"
    }), r.dispatchEvent(
      new CustomEvent(r.fatalErrorEvent, {
        detail: {
          logs: r.getLogs(),
          source: n.source
        }
      })
    ));
  });
}, Tr = async (r, { pluginPath: t, pluginName: n }, p) => {
  p == null || p.tracker.setCaption(`Activating ${n || t}`);
  const l = await r.documentRoot, i = await r.run({
    code: `<?php
      define( 'WP_ADMIN', true );
      require_once( ${ie(l)}. "/wp-load.php" );
      require_once( ${ie(l)}. "/wp-admin/includes/plugin.php" );

      // Set current user to admin
      wp_set_current_user( get_users(array('role' => 'Administrator') )[0]->ID );

      $plugin_path = ${ie(t)};
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
    throw ae.debug(i), new Error(
      `Plugin ${t} could not be activated – WordPress exited with no error. Sometimes, when $_SERVER or site options are not configured correctly, WordPress exits early with a 301 redirect. Inspect the "debug" logs in the console for more details`
    );
}, et = async (r, { themeFolderName: t }, n) => {
  n == null || n.tracker.setCaption(`Activating ${t}`);
  const p = await r.documentRoot, l = `${p}/wp-content/themes/${t}`;
  if (!await r.fileExists(l))
    throw new Error(`
      Couldn't activate theme ${t}.
      Theme not found at the provided theme path: ${l}.
      Check the theme path to ensure it's correct.
      If the theme is not installed, you can install it using the installTheme step.
      More info can be found in the Blueprint documentation: https://wordpress.github.io/wordpress-playground/blueprints-api/steps/#ActivateThemeStep
    `);
  const i = await r.run({
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
      docroot: p,
      themeFolderName: t
    }
  });
  if (i.text !== "Theme activated successfully")
    throw ae.debug(i), new Error(
      `Theme ${t} could not be activated – WordPress exited with no error. Sometimes, when $_SERVER or site options are not configured correctly, WordPress exits early with a 301 redirect. Inspect the "debug" logs in the console for more details`
    );
}, Wt = async (r, { code: t }) => await r.run({ code: t }), Mt = async (r, { options: t }) => await r.run(t), rt = async (r, { path: t }) => {
  await r.unlink(t);
}, Bt = async (r, { sql: t }, n) => {
  n == null || n.tracker.setCaption("Executing SQL Queries");
  const p = `/tmp/${At()}.sql`;
  await r.writeFile(
    p,
    new Uint8Array(await t.arrayBuffer())
  );
  const l = await r.documentRoot, i = lr({ docroot: l, sqlFilename: p }), e = await r.run({
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
  return await rt(r, { path: p }), e;
}, kr = async (r, { request: t }) => {
  ae.warn(
    'Deprecated: The Blueprint step "request" is deprecated and will be removed in a future release.'
  );
  const n = await r.request(t);
  if (n.httpStatusCode > 399 || n.httpStatusCode < 200)
    throw ae.warn("WordPress response was", { response: n }), new Error(
      `Request failed with status ${n.httpStatusCode}`
    );
  return n;
}, Ut = `<?php

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
`, sr = async (r, { consts: t, method: n = "define-before-run" }) => {
  switch (n) {
    case "define-before-run":
      await zt(r, t);
      break;
    case "rewrite-wp-config": {
      const p = await r.documentRoot, l = se(p, "/wp-config.php"), i = await r.readFileAsText(l), e = await Vt(
        r,
        i,
        t
      );
      await r.writeFile(l, e);
      break;
    }
    default:
      throw new Error(`Invalid method: ${n}`);
  }
};
async function zt(r, t) {
  for (const n in t)
    await r.defineConstant(n, t[n]);
}
async function Vt(r, t, n) {
  await r.writeFile("/tmp/code.php", t);
  const p = lr({
    consts: n
  });
  return await r.run({
    code: `${Ut}
  $wp_config_path = '/tmp/code.php';
  $wp_config = file_get_contents($wp_config_path);
  $new_wp_config = rewrite_wp_config_to_define_constants($wp_config, ${p.consts});
  file_put_contents($wp_config_path, $new_wp_config);
  `
  }), await r.readFileAsText("/tmp/code.php");
}
const Or = async (r, { username: t = "admin", password: n = "password" } = {}, p) => {
  var i, e, u;
  p == null || p.tracker.setCaption((p == null ? void 0 : p.initialCaption) || "Logging in"), await r.request({
    url: "/wp-login.php"
  });
  const l = await r.request({
    url: "/wp-login.php",
    method: "POST",
    body: {
      log: t,
      pwd: n,
      rememberme: "forever"
    }
  });
  if (!((u = (e = (i = l.headers) == null ? void 0 : i.location) == null ? void 0 : e[0]) != null && u.includes("/wp-admin/")))
    throw ae.warn("WordPress response was", {
      response: l,
      text: l.text
    }), new Error(
      `Failed to log in as ${t} with password ${n}`
    );
}, tt = async (r, { options: t }) => {
  const n = await r.documentRoot;
  await r.run({
    code: `<?php
    include ${ie(n)} . '/wp-load.php';
    $site_options = ${ie(t)};
    foreach($site_options as $name => $value) {
      update_option($name, $value);
    }
    echo "Success";
    `
  });
}, Ht = async (r, { meta: t, userId: n }) => {
  const p = await r.documentRoot;
  await r.run({
    code: `<?php
    include ${ie(p)} . '/wp-load.php';
    $meta = ${ie(t)};
    foreach($meta as $name => $value) {
      update_user_meta(${ie(n)}, $name, $value);
    }
    `
  });
};
function st(r) {
  return r.pathname.startsWith("/scope:");
}
function Gt(r) {
  return st(r) ? r.pathname.split("/")[1].split(":")[1] : null;
}
const Yt = async (r) => {
  var E;
  await sr(r, {
    consts: {
      WP_ALLOW_MULTISITE: 1
    }
  });
  const t = new URL(await r.absoluteUrl);
  if (t.port !== "") {
    let S = `The current host is ${t.host}, but WordPress multisites do not support custom ports.`;
    throw t.hostname === "localhost" && (S += " For development, you can set up a playground.test domain using the instructions at https://wordpress.github.io/wordpress-playground/contributing/code."), new Error(S);
  }
  const n = t.pathname.replace(/\/$/, "") + "/", p = `${t.protocol}//${t.hostname}${n}`;
  await tt(r, {
    options: {
      siteurl: p,
      home: p
    }
  }), await Or(r, {});
  const l = await r.documentRoot, e = (await r.run({
    code: `<?php
define( 'WP_ADMIN', true );
require_once(${ie(l)} . "/wp-load.php");

// Set current user to admin
( get_users(array('role' => 'Administrator') )[0] );

require_once(${ie(l)} . "/wp-admin/includes/plugin.php");
$plugins_root = ${ie(l)} . "/wp-content/plugins";
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
  })).json, h = (E = (await kr(r, {
    request: {
      url: "/wp-admin/network.php"
    }
  })).text.match(
    /name="_wpnonce"\s+value="([^"]+)"/
  )) == null ? void 0 : E[1], b = await kr(r, {
    request: {
      url: "/wp-admin/network.php",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: Zt({
        _wpnonce: h,
        _wp_http_referer: n + "wp-admin/network.php",
        sitename: "My WordPress Website Sites",
        email: "admin@localhost.com",
        submit: "Install"
      })
    }
  });
  if (b.httpStatusCode !== 200)
    throw ae.warn("WordPress response was", {
      response: b,
      text: b.text,
      headers: b.headers
    }), new Error(
      `Failed to enable multisite. Response code was ${b.httpStatusCode}`
    );
  await sr(r, {
    consts: {
      MULTISITE: !0,
      SUBDOMAIN_INSTALL: !1,
      SITE_ID_CURRENT_SITE: 1,
      BLOG_ID_CURRENT_SITE: 1,
      DOMAIN_CURRENT_SITE: t.hostname,
      PATH_CURRENT_SITE: n
    }
  });
  const k = new URL(await r.absoluteUrl), y = st(k) ? "scope:" + Gt(k) : null;
  await r.writeFile(
    "/internal/shared/preload/sunrise.php",
    `<?php
  $_SERVER['HTTP_HOST'] = ${ie(k.hostname)};
  $folder = ${ie(y)};
  if ($folder && strpos($_SERVER['REQUEST_URI'],"/$folder") === false) {
    $_SERVER['REQUEST_URI'] = "/$folder/" . ltrim($_SERVER['REQUEST_URI'], '/');
  }
`
  ), await r.writeFile(
    "/internal/shared/mu-plugins/sunrise.php",
    `<?php
    if ( !defined( 'BLOG_ID_CURRENT_SITE' ) ) {
      define( 'BLOG_ID_CURRENT_SITE', 1 );
    }
`
  ), await Or(r, {});
  for (const S of e)
    await Tr(r, {
      pluginPath: S
    });
};
function Zt(r) {
  return Object.keys(r).map(
    (t) => encodeURIComponent(t) + "=" + encodeURIComponent(r[t])
  ).join("&");
}
const Qt = async (r, { fromPath: t, toPath: n }) => {
  await r.writeFile(
    n,
    await r.readFileAsBuffer(t)
  );
}, Jt = async (r, { fromPath: t, toPath: n }) => {
  await r.mv(t, n);
}, Kt = async (r, { path: t }) => {
  await r.mkdir(t);
}, Xt = async (r, { path: t }) => {
  await r.rmdir(t);
}, it = async (r, { path: t, data: n }) => {
  n instanceof File && (n = new Uint8Array(await n.arrayBuffer())), t.startsWith("/wordpress/wp-content/mu-plugins") && !await r.fileExists("/wordpress/wp-content/mu-plugins") && await r.mkdir("/wordpress/wp-content/mu-plugins"), await r.writeFile(t, n);
}, nt = async (r, { siteUrl: t }) => {
  await sr(r, {
    consts: {
      WP_HOME: t,
      WP_SITEURL: t
    }
  });
}, es = async (r, { file: t }, n) => {
  var l;
  (l = n == null ? void 0 : n.tracker) == null || l.setCaption("Importing content"), await it(r, {
    path: "/tmp/import.wxr",
    data: t
  });
  const p = await r.documentRoot;
  await r.run({
    code: `<?php
    require ${ie(p)} . '/wp-load.php';
    require ${ie(p)} . '/wp-admin/includes/admin.php';

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
}, ot = async (r, { themeSlug: t = "" }, n) => {
  var l;
  (l = n == null ? void 0 : n.tracker) == null || l.setCaption("Importing theme starter content");
  const p = await r.documentRoot;
  await r.run({
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
      $_REQUEST['customize_theme'] = ${ie(t)} ?: get_stylesheet();

      /*
       * Claim this is a ajax request saving settings, to avoid the preview filters being applied.
       */
      $_REQUEST['action'] = 'customize_save';
      add_filter( 'wp_doing_ajax', '__return_true' );

      $_GET = $_REQUEST;
    }
    playground_add_filter( 'plugins_loaded', 'importThemeStarterContent_plugins_loaded', 0 );

    require ${ie(p)} . '/wp-load.php';

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
}, yr = "/tmp/file.zip", at = async (r, t, n, p = !0) => {
  if (t instanceof File) {
    const i = t;
    t = yr, await r.writeFile(
      t,
      new Uint8Array(await i.arrayBuffer())
    );
  }
  const l = lr({
    zipPath: t,
    extractToPath: n,
    overwriteFiles: p
  });
  await r.run({
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
        unzip(${l.zipPath}, ${l.extractToPath}, ${l.overwriteFiles});
        `
  }), await r.fileExists(yr) && await r.unlink(yr);
}, jr = async (r, { zipFile: t, zipPath: n, extractToPath: p }) => {
  if (n)
    ae.warn(
      'The "zipPath" option of the unzip() Blueprint step is deprecated and will be removed. Use "zipFile" instead.'
    );
  else if (!t)
    throw new Error("Either zipPath or zipFile must be provided");
  await at(r, t || n, p);
}, rs = async (r, { wordPressFilesZip: t, pathInZip: n = "" }) => {
  const p = await r.documentRoot;
  let l = se("/tmp", "import");
  await r.mkdir(l), await jr(r, {
    zipFile: t,
    extractToPath: l
  }), l = se(l, n);
  const i = se(l, "wp-content"), e = se(p, "wp-content");
  for (const k of Yr) {
    const y = se(
      i,
      k
    );
    await Cr(r, y);
    const E = se(e, k);
    await r.fileExists(E) && (await r.mkdir(Qr(y)), await r.mv(E, y));
  }
  const u = se(
    l,
    "wp-content",
    "database"
  );
  await r.fileExists(u) || await r.mv(
    se(p, "wp-content", "database"),
    u
  );
  const h = await r.listFiles(l);
  for (const k of h)
    await Cr(r, se(p, k)), await r.mv(
      se(l, k),
      se(p, k)
    );
  await r.rmdir(l), await nt(r, {
    siteUrl: await r.absoluteUrl
  });
  const b = ie(
    se(p, "wp-admin", "upgrade.php")
  );
  await r.run({
    code: `<?php
            $_GET['step'] = 'upgrade_db';
            require ${b};
            `
  });
};
async function Cr(r, t) {
  await r.fileExists(t) && (await r.isDir(t) ? await r.rmdir(t) : await r.unlink(t));
}
async function ts(r) {
  const t = await r.request({
    url: "/wp-admin/export.php?download=true&content=all"
  });
  return new File([t.bytes], "export.xml");
}
async function pt(r, {
  targetPath: t,
  zipFile: n,
  ifAlreadyInstalled: p = "overwrite"
}) {
  const i = n.name.replace(/\.zip$/, ""), e = se(await r.documentRoot, "wp-content"), u = se(e, Kr()), h = se(u, "assets", i);
  await r.fileExists(h) && await r.rmdir(u, {
    recursive: !0
  }), await r.mkdir(u);
  try {
    await jr(r, {
      zipFile: n,
      extractToPath: h
    });
    let b = await r.listFiles(h, {
      prependPath: !0
    });
    b = b.filter((I) => !I.endsWith("/__MACOSX"));
    const k = b.length === 1 && await r.isDir(b[0]);
    let y, E = "";
    k ? (E = b[0], y = b[0].split("/").pop()) : (E = h, y = i);
    const S = `${t}/${y}`;
    if (await r.fileExists(S)) {
      if (!await r.isDir(S))
        throw new Error(
          `Cannot install asset ${y} to ${S} because a file with the same name already exists. Note it's a file, not a directory! Is this by mistake?`
        );
      if (p === "overwrite")
        await r.rmdir(S, {
          recursive: !0
        });
      else {
        if (p === "skip")
          return {
            assetFolderPath: S,
            assetFolderName: y
          };
        throw new Error(
          `Cannot install asset ${y} to ${t} because it already exists and the ifAlreadyInstalled option was set to ${p}`
        );
      }
    }
    return await r.mv(E, S), {
      assetFolderPath: S,
      assetFolderName: y
    };
  } finally {
    await r.rmdir(u, {
      recursive: !0
    });
  }
}
function fr(r) {
  const t = r.split(".").shift().replace(/-/g, " ");
  return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
}
const ss = async (r, { pluginZipFile: t, ifAlreadyInstalled: n, options: p = {} }, l) => {
  const i = t.name.split("/").pop() || "plugin.zip", e = fr(i);
  l == null || l.tracker.setCaption(`Installing the ${e} plugin`);
  const { assetFolderPath: u } = await pt(r, {
    ifAlreadyInstalled: n,
    zipFile: t,
    targetPath: `${await r.documentRoot}/wp-content/plugins`
  });
  ("activate" in p ? p.activate : !0) && await Tr(
    r,
    {
      pluginPath: u,
      pluginName: e
    },
    l
  );
}, is = async (r, { themeZipFile: t, ifAlreadyInstalled: n, options: p = {} }, l) => {
  const i = fr(t.name);
  l == null || l.tracker.setCaption(`Installing the ${i} theme`);
  const { assetFolderName: e } = await pt(r, {
    ifAlreadyInstalled: n,
    zipFile: t,
    targetPath: `${await r.documentRoot}/wp-content/themes`
  });
  ("activate" in p ? p.activate : !0) && await et(
    r,
    {
      themeFolderName: e
    },
    l
  ), ("importStarterContent" in p ? p.importStarterContent : !1) && await ot(
    r,
    {
      themeSlug: e
    },
    l
  );
}, ns = async (r, t, n) => {
  var l;
  (l = n == null ? void 0 : n.tracker) == null || l.setCaption("Resetting WordPress data");
  const p = await r.documentRoot;
  await r.run({
    env: {
      DOCROOT: p
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
}, os = async (r, { options: t }) => {
  await r.request({
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
}, as = async (r, { selfContained: t = !1 } = {}) => {
  const n = "/tmp/wordpress-playground.zip", p = await r.documentRoot, l = se(p, "wp-content");
  let i = Yr;
  t && (i = i.filter((h) => !h.startsWith("themes/twenty")).filter(
    (h) => h !== "mu-plugins/sqlite-database-integration"
  ));
  const e = lr({
    zipPath: n,
    wpContentPath: l,
    documentRoot: p,
    exceptPaths: i.map(
      (h) => se(p, "wp-content", h)
    ),
    additionalPaths: t ? {
      [se(p, "wp-config.php")]: "wp-config.php"
    } : {}
  });
  await ls(
    r,
    `zipDir(${e.wpContentPath}, ${e.zipPath}, array(
      'exclude_paths' => ${e.exceptPaths},
      'zip_root'      => ${e.documentRoot},
      'additional_paths' => ${e.additionalPaths}
    ));`
  );
  const u = await r.readFileAsBuffer(n);
  return r.unlink(n), u;
}, ps = `<?php

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
async function ls(r, t) {
  return await r.run({
    code: ps + t
  });
}
const fs = async (r, { command: t, wpCliPath: n = "/tmp/wp-cli.phar" }) => {
  if (!await r.fileExists(n))
    throw new Error(`wp-cli.phar not found at ${n}`);
  let p;
  if (typeof t == "string" ? (t = t.trim(), p = us(t)) : p = t, p.shift() !== "wp")
    throw new Error('The first argument must be "wp".');
  await r.writeFile("/tmp/stdout", ""), await r.writeFile("/tmp/stderr", ""), await r.writeFile(
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
    ], ${ie(p)});

    // Provide stdin, stdout, stderr streams outside of
    // the CLI SAPI.
    define('STDIN', fopen('php://stdin', 'rb'));
    define('STDOUT', fopen('php://stdout', 'wb'));
    define('STDERR', fopen('php://stderr', 'wb'));

    require( ${ie(n)} );
    `
  );
  const i = await r.run({
    scriptPath: "/wordpress/run-cli.php"
  });
  if (i.errors)
    throw new Error(i.errors);
  return i;
};
function us(r) {
  let p = 0, l = "";
  const i = [];
  let e = "";
  for (let u = 0; u < r.length; u++) {
    const h = r[u];
    p === 0 ? h === '"' || h === "'" ? (p = 1, l = h) : h.match(/\s/) ? (e && i.push(e), e = "") : e += h : p === 1 && (h === "\\" ? (u++, e += r[u]) : h === l ? (p = 0, l = "") : e += h);
  }
  return e && i.push(e), i;
}
const ds = async (r, { language: t }, n) => {
  n == null || n.tracker.setCaption((n == null ? void 0 : n.initialCaption) || "Translating"), await r.defineConstant("WPLANG", t);
  const p = await r.documentRoot, i = [
    {
      url: `https://downloads.wordpress.org/translation/core/${(await r.run({
        code: `<?php
      require '${p}/wp-includes/version.php';
      echo $wp_version;
    `
      })).text}/${t}.zip`,
      type: "core"
    }
  ], u = (await r.run({
    code: `<?php
    require_once('${p}/wp-load.php');
    require_once('${p}/wp-admin/includes/plugin.php');
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
  for (const { slug: k, version: y } of u)
    i.push({
      url: `https://downloads.wordpress.org/translation/plugin/${k}/${y}/${t}.zip`,
      type: "plugin"
    });
  const b = (await r.run({
    code: `<?php
    require_once('${p}/wp-load.php');
    require_once('${p}/wp-admin/includes/theme.php');
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
  for (const { slug: k, version: y } of b)
    i.push({
      url: `https://downloads.wordpress.org/translation/theme/${k}/${y}/${t}.zip`,
      type: "theme"
    });
  await r.isDir(`${p}/wp-content/languages/plugins`) || await r.mkdir(`${p}/wp-content/languages/plugins`), await r.isDir(`${p}/wp-content/languages/themes`) || await r.mkdir(`${p}/wp-content/languages/themes`);
  for (const { url: k, type: y } of i)
    try {
      const E = await fetch(k);
      if (!E.ok)
        throw new Error(
          `Failed to download translations for ${y}: ${E.statusText}`
        );
      let S = `${p}/wp-content/languages`;
      y === "plugin" ? S += "/plugins" : y === "theme" && (S += "/themes"), await at(
        r,
        new File([await E.blob()], `${t}-${y}.zip`),
        S
      );
    } catch (E) {
      if (y === "core")
        throw new Error(
          `Failed to download translations for WordPress. Please check if the language code ${t} is correct. You can find all available languages and translations on https://translate.wordpress.org/.`
        );
      ae.warn(`Error downloading translations for ${y}: ${E}`);
    }
}, cs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  activatePlugin: Tr,
  activateTheme: et,
  cp: Qt,
  defineSiteUrl: nt,
  defineWpConfigConsts: sr,
  enableMultisite: Yt,
  exportWXR: ts,
  importThemeStarterContent: ot,
  importWordPressFiles: rs,
  importWxr: es,
  installPlugin: ss,
  installTheme: is,
  login: Or,
  mkdir: Kt,
  mv: Jt,
  request: kr,
  resetData: ns,
  rm: rt,
  rmdir: Xt,
  runPHP: Wt,
  runPHPWithOptions: Mt,
  runSql: Bt,
  runWpInstallationWizard: os,
  setSiteLanguage: ds,
  setSiteOptions: tt,
  unzip: jr,
  updateUserMeta: Ht,
  wpCLI: fs,
  writeFile: it,
  zipWpContent: as
}, Symbol.toStringTag, { value: "Module" })), ms = 5 * 1024 * 1024;
function ys(r, t) {
  const n = r.headers.get("content-length") || "", p = parseInt(n, 10) || ms;
  function l(i, e) {
    t(
      new CustomEvent("progress", {
        detail: {
          loaded: i,
          total: e
        }
      })
    );
  }
  return new Response(
    new ReadableStream({
      async start(i) {
        if (!r.body) {
          i.close();
          return;
        }
        const e = r.body.getReader();
        let u = 0;
        for (; ; )
          try {
            const { done: h, value: b } = await e.read();
            if (b && (u += b.byteLength), h) {
              l(u, u), i.close();
              break;
            } else
              l(u, p), i.enqueue(b);
          } catch (h) {
            ae.error({ e: h }), i.error(h);
            break;
          }
      }
    }),
    {
      status: r.status,
      statusText: r.statusText,
      headers: r.headers
    }
  );
}
const hr = 1e-5;
class ur extends EventTarget {
  constructor({
    weight: t = 1,
    caption: n = "",
    fillTime: p = 4
  } = {}) {
    super(), this._selfWeight = 1, this._selfDone = !1, this._selfProgress = 0, this._selfCaption = "", this._isFilling = !1, this._subTrackers = [], this._weight = t, this._selfCaption = n, this._fillTime = p;
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
  stage(t, n = "") {
    if (t || (t = this._selfWeight), this._selfWeight - t < -hr)
      throw new Error(
        `Cannot add a stage with weight ${t} as the total weight of registered stages would exceed 1.`
      );
    this._selfWeight -= t;
    const p = new ur({
      caption: n,
      weight: t,
      fillTime: this._fillTime
    });
    return this._subTrackers.push(p), p.addEventListener("progress", () => this.notifyProgress()), p.addEventListener("done", () => {
      this.done && this.notifyDone();
    }), p;
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
    const n = 100, p = this._fillTime / n;
    this._fillInterval = setInterval(() => {
      this.set(this._selfProgress + 1), t && this._selfProgress >= 99 && clearInterval(this._fillInterval);
    }, p);
  }
  set(t) {
    this._selfProgress = Math.min(t, 100), this.notifyProgress(), this._selfProgress + hr >= 100 && this.finish();
  }
  finish() {
    this._fillInterval && clearInterval(this._fillInterval), this._selfDone = !0, this._selfProgress = 100, this._isFilling = !1, this._fillInterval = void 0, this.notifyProgress(), this.notifyDone();
  }
  get caption() {
    for (let t = this._subTrackers.length - 1; t >= 0; t--)
      if (!this._subTrackers[t].done) {
        const n = this._subTrackers[t].caption;
        if (n)
          return n;
      }
    return this._selfCaption;
  }
  setCaption(t) {
    this._selfCaption = t, this.notifyProgress();
  }
  get done() {
    return this.progress + hr >= 100;
  }
  get progress() {
    if (this._selfDone)
      return 100;
    const t = this._subTrackers.reduce(
      (n, p) => n + p.progress * p.weight,
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
    }), this.addEventListener("progress", (n) => {
      t.setProgress({
        progress: n.detail.progress,
        caption: n.detail.caption
      });
    }), this.addEventListener("done", () => {
      t.setLoaded();
    });
  }
  addEventListener(t, n) {
    super.addEventListener(t, n);
  }
  removeEventListener(t, n) {
    super.removeEventListener(t, n);
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
const ir = {
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
function hs(r) {
  const t = typeof r == "object" ? r == null ? void 0 : r.errno : null;
  if (t in ir)
    return ir[t];
}
function _e(r = "") {
  return function(n, p, l) {
    const i = l.value;
    l.value = function(...e) {
      try {
        return i.apply(this, e);
      } catch (u) {
        const h = typeof u == "object" ? u == null ? void 0 : u.errno : null;
        if (h in ir) {
          const b = ir[h], k = typeof e[1] == "string" ? e[1] : null, y = k !== null ? r.replaceAll("{path}", k) : r;
          throw new Error(`${y}: ${b}`, {
            cause: u
          });
        }
        throw u;
      }
    };
  };
}
var gs = Object.defineProperty, bs = Object.getOwnPropertyDescriptor, ke = (r, t, n, p) => {
  for (var l = p > 1 ? void 0 : p ? bs(t, n) : t, i = r.length - 1, e; i >= 0; i--)
    (e = r[i]) && (l = (p ? e(t, n, l) : e(l)) || l);
  return p && l && gs(t, n, l), l;
};
const Oe = class me {
  static readFileAsText(t, n) {
    return new TextDecoder().decode(me.readFileAsBuffer(t, n));
  }
  static readFileAsBuffer(t, n) {
    return t.readFile(n);
  }
  static writeFile(t, n, p) {
    t.writeFile(n, p);
  }
  static unlink(t, n) {
    t.unlink(n);
  }
  /**
   * Moves a file or directory in the PHP filesystem to a
   * new location.
   *
   * @param oldPath The path to rename.
   * @param newPath The new path.
   */
  static mv(t, n, p) {
    try {
      const l = t.lookupPath(n).node.mount, i = me.fileExists(t, p) ? t.lookupPath(p).node.mount : t.lookupPath(Qr(p)).node.mount;
      l.mountpoint !== i.mountpoint ? (me.copyRecursive(t, n, p), me.rmdir(t, n, { recursive: !0 })) : t.rename(n, p);
    } catch (l) {
      const i = hs(l);
      throw i ? new Error(
        `Could not move ${n} to ${p}: ${i}`,
        {
          cause: l
        }
      ) : l;
    }
  }
  static rmdir(t, n, p = { recursive: !0 }) {
    p != null && p.recursive && me.listFiles(t, n).forEach((l) => {
      const i = `${n}/${l}`;
      me.isDir(t, i) ? me.rmdir(t, i, p) : me.unlink(t, i);
    }), t.rmdir(n);
  }
  static listFiles(t, n, p = { prependPath: !1 }) {
    if (!me.fileExists(t, n))
      return [];
    try {
      const l = t.readdir(n).filter(
        (i) => i !== "." && i !== ".."
      );
      if (p.prependPath) {
        const i = n.replace(/\/$/, "");
        return l.map((e) => `${i}/${e}`);
      }
      return l;
    } catch (l) {
      return ae.error(l, { path: n }), [];
    }
  }
  static isDir(t, n) {
    return me.fileExists(t, n) ? t.isDir(t.lookupPath(n).node.mode) : !1;
  }
  /**
   * Checks if a file exists in the PHP filesystem.
   *
   * @param  path – The path to check.
   * @returns True if the path is a file, false otherwise.
   */
  static isFile(t, n) {
    return me.fileExists(t, n) ? t.isFile(t.lookupPath(n).node.mode) : !1;
  }
  static fileExists(t, n) {
    try {
      return t.lookupPath(n), !0;
    } catch {
      return !1;
    }
  }
  static mkdir(t, n) {
    t.mkdirTree(n);
  }
  static copyRecursive(t, n, p) {
    const l = t.lookupPath(n).node;
    if (t.isDir(l.mode)) {
      t.mkdirTree(p);
      const i = t.readdir(n).filter(
        (e) => e !== "." && e !== ".."
      );
      for (const e of i)
        me.copyRecursive(
          t,
          se(n, e),
          se(p, e)
        );
    } else
      t.writeFile(p, t.readFile(n));
  }
};
ke([
  _e('Could not read "{path}"')
], Oe, "readFileAsText", 1);
ke([
  _e('Could not read "{path}"')
], Oe, "readFileAsBuffer", 1);
ke([
  _e('Could not write to "{path}"')
], Oe, "writeFile", 1);
ke([
  _e('Could not unlink "{path}"')
], Oe, "unlink", 1);
ke([
  _e('Could not remove directory "{path}"')
], Oe, "rmdir", 1);
ke([
  _e('Could not list files in "{path}"')
], Oe, "listFiles", 1);
ke([
  _e('Could not stat "{path}"')
], Oe, "isDir", 1);
ke([
  _e('Could not stat "{path}"')
], Oe, "fileExists", 1);
ke([
  _e('Could not create directory "{path}"')
], Oe, "mkdir", 1);
ke([
  _e('Could not copy files from "{path}"')
], Oe, "copyRecursive", 1);
const ws = {
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
class nr {
  constructor(t, n, p, l = "", i = 0) {
    this.httpStatusCode = t, this.headers = n, this.bytes = p, this.exitCode = i, this.errors = l;
  }
  static forHttpCode(t, n = "") {
    return new nr(
      t,
      {},
      new TextEncoder().encode(
        n || ws[t] || ""
      )
    );
  }
  static fromRawData(t) {
    return new nr(
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
  var r;
  return typeof process < "u" && ((r = process.release) == null ? void 0 : r.name) === "node" ? "NODE" : typeof window < "u" ? "WEB" : typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope ? "WORKER" : "NODE";
})();
const Ir = "/internal/shared/php.ini", { hasOwnProperty: gr } = Object.prototype, Er = (r, t = {}) => {
  typeof t == "string" && (t = { section: t }), t.align = t.align === !0, t.newline = t.newline === !0, t.sort = t.sort === !0, t.whitespace = t.whitespace === !0 || t.align === !0, t.platform = t.platform || typeof process < "u" && process.platform, t.bracketedArray = t.bracketedArray !== !1;
  const n = t.platform === "win32" ? `\r
` : `
`, p = t.whitespace ? " = " : "=", l = [], i = t.sort ? Object.keys(r).sort() : Object.keys(r);
  let e = 0;
  t.align && (e = Ee(
    i.filter((b) => r[b] === null || Array.isArray(r[b]) || typeof r[b] != "object").map((b) => Array.isArray(r[b]) ? `${b}[]` : b).concat([""]).reduce((b, k) => Ee(b).length >= Ee(k).length ? b : k)
  ).length);
  let u = "";
  const h = t.bracketedArray ? "[]" : "";
  for (const b of i) {
    const k = r[b];
    if (k && Array.isArray(k))
      for (const y of k)
        u += Ee(`${b}${h}`).padEnd(e, " ") + p + Ee(y) + n;
    else
      k && typeof k == "object" ? l.push(b) : u += Ee(b).padEnd(e, " ") + p + Ee(k) + n;
  }
  t.section && u.length && (u = "[" + Ee(t.section) + "]" + (t.newline ? n + n : n) + u);
  for (const b of l) {
    const k = lt(b, ".").join("\\."), y = (t.section ? t.section + "." : "") + k, E = Er(r[b], {
      ...t,
      section: y
    });
    u.length && E.length && (u += n), u += E;
  }
  return u;
};
function lt(r, t) {
  var n = 0, p = 0, l = 0, i = [];
  do
    if (l = r.indexOf(t, n), l !== -1) {
      if (n = l + t.length, l > 0 && r[l - 1] === "\\")
        continue;
      i.push(r.slice(p, l)), p = l + t.length;
    }
  while (l !== -1);
  return i.push(r.slice(p)), i;
}
const Dr = (r, t = {}) => {
  t.bracketedArray = t.bracketedArray !== !1;
  const n = /* @__PURE__ */ Object.create(null);
  let p = n, l = null;
  const i = /^\[([^\]]*)\]\s*$|^([^=]+)(=(.*))?$/i, e = r.split(/[\r\n]+/g), u = {};
  for (const b of e) {
    if (!b || b.match(/^\s*[;#]/) || b.match(/^\s*$/))
      continue;
    const k = b.match(i);
    if (!k)
      continue;
    if (k[1] !== void 0) {
      if (l = Xe(k[1]), l === "__proto__") {
        p = /* @__PURE__ */ Object.create(null);
        continue;
      }
      p = n[l] = n[l] || /* @__PURE__ */ Object.create(null);
      continue;
    }
    const y = Xe(k[2]);
    let E;
    t.bracketedArray ? E = y.length > 2 && y.slice(-2) === "[]" : (u[y] = ((u == null ? void 0 : u[y]) || 0) + 1, E = u[y] > 1);
    const S = E ? y.slice(0, -2) : y;
    if (S === "__proto__")
      continue;
    const I = k[3] ? Xe(k[4]) : !0, _ = I === "true" || I === "false" || I === "null" ? JSON.parse(I) : I;
    E && (gr.call(p, S) ? Array.isArray(p[S]) || (p[S] = [p[S]]) : p[S] = []), Array.isArray(p[S]) ? p[S].push(_) : p[S] = _;
  }
  const h = [];
  for (const b of Object.keys(n)) {
    if (!gr.call(n, b) || typeof n[b] != "object" || Array.isArray(n[b]))
      continue;
    const k = lt(b, ".");
    p = n;
    const y = k.pop(), E = y.replace(/\\\./g, ".");
    for (const S of k)
      S !== "__proto__" && ((!gr.call(p, S) || typeof p[S] != "object") && (p[S] = /* @__PURE__ */ Object.create(null)), p = p[S]);
    p === n && E === y || (p[E] = n[b], h.push(b));
  }
  for (const b of h)
    delete n[b];
  return n;
}, ft = (r) => r.startsWith('"') && r.endsWith('"') || r.startsWith("'") && r.endsWith("'"), Ee = (r) => typeof r != "string" || r.match(/[=\r\n]/) || r.match(/^\[/) || r.length > 1 && ft(r) || r !== r.trim() ? JSON.stringify(r) : r.split(";").join("\\;").split("#").join("\\#"), Xe = (r) => {
  if (r = (r || "").trim(), ft(r)) {
    r.charAt(0) === "'" && (r = r.slice(1, -1));
    try {
      r = JSON.parse(r);
    } catch {
    }
  } else {
    let t = !1, n = "";
    for (let p = 0, l = r.length; p < l; p++) {
      const i = r.charAt(p);
      if (t)
        "\\;#".indexOf(i) !== -1 ? n += i : n += "\\" + i, t = !1;
      else {
        if (";#".indexOf(i) !== -1)
          break;
        i === "\\" ? t = !0 : n += i;
      }
    }
    return t && (n += "\\"), n.trim();
  }
  return r;
};
var Wr = {
  parse: Dr,
  decode: Dr,
  stringify: Er,
  encode: Er,
  safe: Ee,
  unsafe: Xe
};
async function li(r, t) {
  const n = Wr.parse(await r.readFileAsText(Ir));
  for (const [p, l] of Object.entries(t))
    l == null ? delete n[p] : n[p] = l;
  await r.writeFile(Ir, Wr.stringify(n));
}
ReadableStream.prototype[Symbol.asyncIterator] || (ReadableStream.prototype[Symbol.asyncIterator] = async function* () {
  const r = this.getReader();
  try {
    for (; ; ) {
      const { done: t, value: n } = await r.read();
      if (t)
        return;
      yield n;
    }
  } finally {
    r.releaseLock();
  }
}, ReadableStream.prototype.iterate = // @ts-ignore
ReadableStream.prototype[Symbol.asyncIterator]);
const Ar = [
  "8.3",
  "8.2",
  "8.1",
  "8.0",
  "7.4",
  "7.3",
  "7.2",
  "7.1",
  "7.0"
], vs = Ar[0], fi = Ar, ut = [
  "iconv",
  "mbstring",
  "xml-bundle",
  "gd"
], Mr = {
  "kitchen-sink": ut,
  light: []
}, Ps = [
  "vfs",
  "literal",
  "wordpress.org/themes",
  "wordpress.org/plugins",
  "url"
];
function _s(r) {
  return r && typeof r == "object" && typeof r.resource == "string" && Ps.includes(r.resource);
}
class Se {
  /**
   * Creates a new Resource based on the given file reference
   *
   * @param ref The file reference to create the Resource for
   * @param options Additional options for the Resource
   * @returns A new Resource instance
   */
  static create(t, { semaphore: n, progress: p }) {
    let l;
    switch (t.resource) {
      case "vfs":
        l = new ks(t, p);
        break;
      case "literal":
        l = new Os(t, p);
        break;
      case "wordpress.org/themes":
        l = new Ts(t, p);
        break;
      case "wordpress.org/plugins":
        l = new js(t, p);
        break;
      case "url":
        l = new $s(t, p);
        break;
      default:
        throw new Error(`Invalid resource: ${t}`);
    }
    return l = new As(l), n && (l = new qs(l, n)), l;
  }
  setPlayground(t) {
    this.playground = t;
  }
  /** Whether this Resource is loaded asynchronously */
  get isAsync() {
    return !1;
  }
}
class ks extends Se {
  /**
   * Creates a new instance of `VFSResource`.
   * @param playground The playground client.
   * @param resource The VFS reference.
   * @param progress The progress tracker.
   */
  constructor(t, n) {
    super(), this.resource = t, this.progress = n;
  }
  /** @inheritDoc */
  async resolve() {
    var n;
    const t = await this.playground.readFileAsBuffer(
      this.resource.path
    );
    return (n = this.progress) == null || n.set(100), new File([t], this.name);
  }
  /** @inheritDoc */
  get name() {
    return this.resource.path.split("/").pop() || "";
  }
}
class Os extends Se {
  /**
   * Creates a new instance of `LiteralResource`.
   * @param resource The literal reference.
   * @param progress The progress tracker.
   */
  constructor(t, n) {
    super(), this.resource = t, this.progress = n;
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
class qr extends Se {
  /**
   * Creates a new instance of `FetchResource`.
   * @param progress The progress tracker.
   */
  constructor(t) {
    super(), this.progress = t;
  }
  /** @inheritDoc */
  async resolve() {
    var n, p;
    (n = this.progress) == null || n.setCaption(this.caption);
    const t = this.getURL();
    try {
      let l = await fetch(t);
      if (!l.ok)
        throw new Error(`Could not download "${t}"`);
      if (l = await ys(
        l,
        ((p = this.progress) == null ? void 0 : p.loadingListener) ?? Es
      ), l.status !== 200)
        throw new Error(`Could not download "${t}"`);
      return new File([await l.blob()], this.name);
    } catch (l) {
      throw new Error(
        `Could not download "${t}".
        Check if the URL is correct and the server is reachable.
        If it is reachable, the server might be blocking the request.
        Check the browser console and network tabs for more information.

        ## Does the console show the error "No 'Access-Control-Allow-Origin' header"?

        This means the server that hosts your file does not allow requests from other sites
        (cross-origin requests, or CORS). You need to move the asset to a server that allows
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
        ${l}`
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
const Es = () => {
};
class $s extends qr {
  /**
   * Creates a new instance of `UrlResource`.
   * @param resource The URL reference.
   * @param progress The progress tracker.
   */
  constructor(t, n) {
    super(n), this.resource = t;
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
class Ts extends qr {
  constructor(t, n) {
    super(n), this.resource = t;
  }
  get name() {
    return fr(this.resource.slug);
  }
  getURL() {
    return `https://downloads.wordpress.org/theme/${dt(this.resource.slug)}`;
  }
}
class js extends qr {
  constructor(t, n) {
    super(n), this.resource = t;
  }
  /** @inheritDoc */
  get name() {
    return fr(this.resource.slug);
  }
  /** @inheritDoc */
  getURL() {
    return `https://downloads.wordpress.org/plugin/${dt(this.resource.slug)}`;
  }
}
function dt(r) {
  return !r || r.endsWith(".zip") ? r : r + ".latest-stable.zip";
}
class ct extends Se {
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
class As extends ct {
  /** @inheritDoc */
  async resolve() {
    return this.promise || (this.promise = super.resolve()), this.promise;
  }
}
class qs extends ct {
  constructor(t, n) {
    super(t), this.semaphore = n;
  }
  /** @inheritDoc */
  async resolve() {
    return this.isAsync ? this.semaphore.run(() => super.resolve()) : super.resolve();
  }
}
const Rs = {
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
          items: { type: "string" },
          description: "Relevant categories to help users find your Blueprint in the future Blueprints section on WordPress.org."
        }
      },
      required: ["title", "author"],
      additionalProperties: !1,
      description: "Optional metadata. Used by the Blueprints gallery at https://github.com/WordPress/blueprints"
    },
    preferredVersions: {
      type: "object",
      properties: {
        php: {
          anyOf: [
            { $ref: "#/definitions/SupportedPHPVersion" },
            { type: "string", const: "latest" }
          ],
          description: "The preferred PHP version to use. If not specified, the latest supported version will be used"
        },
        wp: {
          type: "string",
          description: "The preferred WordPress version to use. If not specified, the latest supported version will be used"
        }
      },
      required: ["php", "wp"],
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
      additionalProperties: { type: "string" },
      description: "PHP Constants to define on every request"
    },
    plugins: {
      type: "array",
      items: {
        anyOf: [{ type: "string" }, { $ref: "#/definitions/FileReference" }]
      },
      description: "WordPress plugins to install and activate"
    },
    siteOptions: {
      type: "object",
      additionalProperties: { type: "string" },
      properties: {
        blogname: { type: "string", description: "The site title" }
      },
      description: "WordPress site options to define"
    },
    login: {
      anyOf: [
        { type: "boolean" },
        {
          type: "object",
          properties: {
            username: { type: "string" },
            password: { type: "string" }
          },
          required: ["username", "password"],
          additionalProperties: !1
        }
      ],
      description: "User to log in as. If true, logs the user in as admin/password."
    },
    phpExtensionBundles: {
      type: "array",
      items: { $ref: "#/definitions/SupportedPHPExtensionBundle" },
      description: "The PHP extensions to use."
    },
    steps: {
      type: "array",
      items: {
        anyOf: [
          { $ref: "#/definitions/StepDefinition" },
          { type: "string" },
          { not: {} },
          { type: "boolean", const: !1 },
          { type: "null" }
        ]
      },
      description: "The steps to run after every other operation in this Blueprint was executed."
    },
    $schema: { type: "string" }
  },
  additionalProperties: !1
}, Ss = {
  type: "string",
  enum: ["8.3", "8.2", "8.1", "8.0", "7.4", "7.3", "7.2", "7.1", "7.0"]
}, Ls = { type: "string", enum: ["kitchen-sink", "light"] }, mt = Object.prototype.hasOwnProperty;
function ee(r, { instancePath: t = "", parentData: n, parentDataProperty: p, rootData: l = r } = {}) {
  let i = null, e = 0;
  const u = e;
  let h = !1;
  const b = e;
  if (e === e)
    if (r && typeof r == "object" && !Array.isArray(r)) {
      let D;
      if (r.resource === void 0 && (D = "resource") || r.path === void 0 && (D = "path")) {
        const J = {
          instancePath: t,
          schemaPath: "#/definitions/VFSReference/required",
          keyword: "required",
          params: { missingProperty: D },
          message: "must have required property '" + D + "'"
        };
        i === null ? i = [J] : i.push(J), e++;
      } else {
        const J = e;
        for (const m in r)
          if (!(m === "resource" || m === "path")) {
            const R = {
              instancePath: t,
              schemaPath: "#/definitions/VFSReference/additionalProperties",
              keyword: "additionalProperties",
              params: { additionalProperty: m },
              message: "must NOT have additional properties"
            };
            i === null ? i = [R] : i.push(R), e++;
            break;
          }
        if (J === e) {
          if (r.resource !== void 0) {
            let m = r.resource;
            const R = e;
            if (typeof m != "string") {
              const V = {
                instancePath: t + "/resource",
                schemaPath: "#/definitions/VFSReference/properties/resource/type",
                keyword: "type",
                params: { type: "string" },
                message: "must be string"
              };
              i === null ? i = [V] : i.push(V), e++;
            }
            if (m !== "vfs") {
              const V = {
                instancePath: t + "/resource",
                schemaPath: "#/definitions/VFSReference/properties/resource/const",
                keyword: "const",
                params: { allowedValue: "vfs" },
                message: "must be equal to constant"
              };
              i === null ? i = [V] : i.push(V), e++;
            }
            var y = R === e;
          } else
            var y = !0;
          if (y)
            if (r.path !== void 0) {
              const m = e;
              if (typeof r.path != "string") {
                const V = {
                  instancePath: t + "/path",
                  schemaPath: "#/definitions/VFSReference/properties/path/type",
                  keyword: "type",
                  params: { type: "string" },
                  message: "must be string"
                };
                i === null ? i = [V] : i.push(V), e++;
              }
              var y = m === e;
            } else
              var y = !0;
        }
      }
    } else {
      const D = {
        instancePath: t,
        schemaPath: "#/definitions/VFSReference/type",
        keyword: "type",
        params: { type: "object" },
        message: "must be object"
      };
      i === null ? i = [D] : i.push(D), e++;
    }
  var E = b === e;
  if (h = h || E, !h) {
    const D = e;
    if (e === e)
      if (r && typeof r == "object" && !Array.isArray(r)) {
        let R;
        if (r.resource === void 0 && (R = "resource") || r.name === void 0 && (R = "name") || r.contents === void 0 && (R = "contents")) {
          const V = {
            instancePath: t,
            schemaPath: "#/definitions/LiteralReference/required",
            keyword: "required",
            params: { missingProperty: R },
            message: "must have required property '" + R + "'"
          };
          i === null ? i = [V] : i.push(V), e++;
        } else {
          const V = e;
          for (const g in r)
            if (!(g === "resource" || g === "name" || g === "contents")) {
              const O = {
                instancePath: t,
                schemaPath: "#/definitions/LiteralReference/additionalProperties",
                keyword: "additionalProperties",
                params: { additionalProperty: g },
                message: "must NOT have additional properties"
              };
              i === null ? i = [O] : i.push(O), e++;
              break;
            }
          if (V === e) {
            if (r.resource !== void 0) {
              let g = r.resource;
              const O = e;
              if (typeof g != "string") {
                const w = {
                  instancePath: t + "/resource",
                  schemaPath: "#/definitions/LiteralReference/properties/resource/type",
                  keyword: "type",
                  params: { type: "string" },
                  message: "must be string"
                };
                i === null ? i = [w] : i.push(w), e++;
              }
              if (g !== "literal") {
                const w = {
                  instancePath: t + "/resource",
                  schemaPath: "#/definitions/LiteralReference/properties/resource/const",
                  keyword: "const",
                  params: { allowedValue: "literal" },
                  message: "must be equal to constant"
                };
                i === null ? i = [w] : i.push(w), e++;
              }
              var S = O === e;
            } else
              var S = !0;
            if (S) {
              if (r.name !== void 0) {
                const g = e;
                if (typeof r.name != "string") {
                  const w = {
                    instancePath: t + "/name",
                    schemaPath: "#/definitions/LiteralReference/properties/name/type",
                    keyword: "type",
                    params: { type: "string" },
                    message: "must be string"
                  };
                  i === null ? i = [w] : i.push(w), e++;
                }
                var S = g === e;
              } else
                var S = !0;
              if (S)
                if (r.contents !== void 0) {
                  let g = r.contents;
                  const O = e, w = e;
                  let $ = !1;
                  const v = e;
                  if (typeof g != "string") {
                    const N = {
                      instancePath: t + "/contents",
                      schemaPath: "#/definitions/LiteralReference/properties/contents/anyOf/0/type",
                      keyword: "type",
                      params: { type: "string" },
                      message: "must be string"
                    };
                    i === null ? i = [N] : i.push(N), e++;
                  }
                  var I = v === e;
                  if ($ = $ || I, !$) {
                    const N = e;
                    if (e === N)
                      if (g && typeof g == "object" && !Array.isArray(g)) {
                        let j;
                        if (g.BYTES_PER_ELEMENT === void 0 && (j = "BYTES_PER_ELEMENT") || g.buffer === void 0 && (j = "buffer") || g.byteLength === void 0 && (j = "byteLength") || g.byteOffset === void 0 && (j = "byteOffset") || g.length === void 0 && (j = "length")) {
                          const M = {
                            instancePath: t + "/contents",
                            schemaPath: "#/definitions/LiteralReference/properties/contents/anyOf/1/required",
                            keyword: "required",
                            params: { missingProperty: j },
                            message: "must have required property '" + j + "'"
                          };
                          i === null ? i = [M] : i.push(M), e++;
                        } else {
                          const M = e;
                          for (const q in g)
                            if (!(q === "BYTES_PER_ELEMENT" || q === "buffer" || q === "byteLength" || q === "byteOffset" || q === "length")) {
                              let H = g[q];
                              const te = e;
                              if (!(typeof H == "number" && isFinite(H))) {
                                const Z = {
                                  instancePath: t + "/contents/" + q.replace(/~/g, "~0").replace(/\//g, "~1"),
                                  schemaPath: "#/definitions/LiteralReference/properties/contents/anyOf/1/additionalProperties/type",
                                  keyword: "type",
                                  params: { type: "number" },
                                  message: "must be number"
                                };
                                i === null ? i = [Z] : i.push(Z), e++;
                              }
                              var _ = te === e;
                              if (!_)
                                break;
                            }
                          if (M === e) {
                            if (g.BYTES_PER_ELEMENT !== void 0) {
                              let q = g.BYTES_PER_ELEMENT;
                              const H = e;
                              if (!(typeof q == "number" && isFinite(q))) {
                                const te = {
                                  instancePath: t + "/contents/BYTES_PER_ELEMENT",
                                  schemaPath: "#/definitions/LiteralReference/properties/contents/anyOf/1/properties/BYTES_PER_ELEMENT/type",
                                  keyword: "type",
                                  params: { type: "number" },
                                  message: "must be number"
                                };
                                i === null ? i = [te] : i.push(te), e++;
                              }
                              var W = H === e;
                            } else
                              var W = !0;
                            if (W) {
                              if (g.buffer !== void 0) {
                                let q = g.buffer;
                                const H = e;
                                if (e === H)
                                  if (q && typeof q == "object" && !Array.isArray(q)) {
                                    let Z;
                                    if (q.byteLength === void 0 && (Z = "byteLength")) {
                                      const C = {
                                        instancePath: t + "/contents/buffer",
                                        schemaPath: "#/definitions/LiteralReference/properties/contents/anyOf/1/properties/buffer/required",
                                        keyword: "required",
                                        params: { missingProperty: Z },
                                        message: "must have required property '" + Z + "'"
                                      };
                                      i === null ? i = [C] : i.push(C), e++;
                                    } else {
                                      const C = e;
                                      for (const U in q)
                                        if (U !== "byteLength") {
                                          const z = {
                                            instancePath: t + "/contents/buffer",
                                            schemaPath: "#/definitions/LiteralReference/properties/contents/anyOf/1/properties/buffer/additionalProperties",
                                            keyword: "additionalProperties",
                                            params: {
                                              additionalProperty: U
                                            },
                                            message: "must NOT have additional properties"
                                          };
                                          i === null ? i = [z] : i.push(z), e++;
                                          break;
                                        }
                                      if (C === e && q.byteLength !== void 0) {
                                        let U = q.byteLength;
                                        if (!(typeof U == "number" && isFinite(U))) {
                                          const z = {
                                            instancePath: t + "/contents/buffer/byteLength",
                                            schemaPath: "#/definitions/LiteralReference/properties/contents/anyOf/1/properties/buffer/properties/byteLength/type",
                                            keyword: "type",
                                            params: { type: "number" },
                                            message: "must be number"
                                          };
                                          i === null ? i = [z] : i.push(z), e++;
                                        }
                                      }
                                    }
                                  } else {
                                    const Z = {
                                      instancePath: t + "/contents/buffer",
                                      schemaPath: "#/definitions/LiteralReference/properties/contents/anyOf/1/properties/buffer/type",
                                      keyword: "type",
                                      params: { type: "object" },
                                      message: "must be object"
                                    };
                                    i === null ? i = [Z] : i.push(Z), e++;
                                  }
                                var W = H === e;
                              } else
                                var W = !0;
                              if (W) {
                                if (g.byteLength !== void 0) {
                                  let q = g.byteLength;
                                  const H = e;
                                  if (!(typeof q == "number" && isFinite(q))) {
                                    const Z = {
                                      instancePath: t + "/contents/byteLength",
                                      schemaPath: "#/definitions/LiteralReference/properties/contents/anyOf/1/properties/byteLength/type",
                                      keyword: "type",
                                      params: { type: "number" },
                                      message: "must be number"
                                    };
                                    i === null ? i = [Z] : i.push(Z), e++;
                                  }
                                  var W = H === e;
                                } else
                                  var W = !0;
                                if (W) {
                                  if (g.byteOffset !== void 0) {
                                    let q = g.byteOffset;
                                    const H = e;
                                    if (!(typeof q == "number" && isFinite(q))) {
                                      const Z = {
                                        instancePath: t + "/contents/byteOffset",
                                        schemaPath: "#/definitions/LiteralReference/properties/contents/anyOf/1/properties/byteOffset/type",
                                        keyword: "type",
                                        params: { type: "number" },
                                        message: "must be number"
                                      };
                                      i === null ? i = [Z] : i.push(Z), e++;
                                    }
                                    var W = H === e;
                                  } else
                                    var W = !0;
                                  if (W)
                                    if (g.length !== void 0) {
                                      let q = g.length;
                                      const H = e;
                                      if (!(typeof q == "number" && isFinite(q))) {
                                        const Z = {
                                          instancePath: t + "/contents/length",
                                          schemaPath: "#/definitions/LiteralReference/properties/contents/anyOf/1/properties/length/type",
                                          keyword: "type",
                                          params: { type: "number" },
                                          message: "must be number"
                                        };
                                        i === null ? i = [Z] : i.push(Z), e++;
                                      }
                                      var W = H === e;
                                    } else
                                      var W = !0;
                                }
                              }
                            }
                          }
                        }
                      } else {
                        const j = {
                          instancePath: t + "/contents",
                          schemaPath: "#/definitions/LiteralReference/properties/contents/anyOf/1/type",
                          keyword: "type",
                          params: { type: "object" },
                          message: "must be object"
                        };
                        i === null ? i = [j] : i.push(j), e++;
                      }
                    var I = N === e;
                    $ = $ || I;
                  }
                  if ($)
                    e = w, i !== null && (w ? i.length = w : i = null);
                  else {
                    const N = {
                      instancePath: t + "/contents",
                      schemaPath: "#/definitions/LiteralReference/properties/contents/anyOf",
                      keyword: "anyOf",
                      params: {},
                      message: "must match a schema in anyOf"
                    };
                    i === null ? i = [N] : i.push(N), e++;
                  }
                  var S = O === e;
                } else
                  var S = !0;
            }
          }
        }
      } else {
        const R = {
          instancePath: t,
          schemaPath: "#/definitions/LiteralReference/type",
          keyword: "type",
          params: { type: "object" },
          message: "must be object"
        };
        i === null ? i = [R] : i.push(R), e++;
      }
    var E = D === e;
    if (h = h || E, !h) {
      const R = e;
      if (e === e)
        if (r && typeof r == "object" && !Array.isArray(r)) {
          let O;
          if (r.resource === void 0 && (O = "resource") || r.slug === void 0 && (O = "slug")) {
            const w = {
              instancePath: t,
              schemaPath: "#/definitions/CoreThemeReference/required",
              keyword: "required",
              params: { missingProperty: O },
              message: "must have required property '" + O + "'"
            };
            i === null ? i = [w] : i.push(w), e++;
          } else {
            const w = e;
            for (const $ in r)
              if (!($ === "resource" || $ === "slug")) {
                const v = {
                  instancePath: t,
                  schemaPath: "#/definitions/CoreThemeReference/additionalProperties",
                  keyword: "additionalProperties",
                  params: { additionalProperty: $ },
                  message: "must NOT have additional properties"
                };
                i === null ? i = [v] : i.push(v), e++;
                break;
              }
            if (w === e) {
              if (r.resource !== void 0) {
                let $ = r.resource;
                const v = e;
                if (typeof $ != "string") {
                  const c = {
                    instancePath: t + "/resource",
                    schemaPath: "#/definitions/CoreThemeReference/properties/resource/type",
                    keyword: "type",
                    params: { type: "string" },
                    message: "must be string"
                  };
                  i === null ? i = [c] : i.push(c), e++;
                }
                if ($ !== "wordpress.org/themes") {
                  const c = {
                    instancePath: t + "/resource",
                    schemaPath: "#/definitions/CoreThemeReference/properties/resource/const",
                    keyword: "const",
                    params: { allowedValue: "wordpress.org/themes" },
                    message: "must be equal to constant"
                  };
                  i === null ? i = [c] : i.push(c), e++;
                }
                var X = v === e;
              } else
                var X = !0;
              if (X)
                if (r.slug !== void 0) {
                  const $ = e;
                  if (typeof r.slug != "string") {
                    const c = {
                      instancePath: t + "/slug",
                      schemaPath: "#/definitions/CoreThemeReference/properties/slug/type",
                      keyword: "type",
                      params: { type: "string" },
                      message: "must be string"
                    };
                    i === null ? i = [c] : i.push(c), e++;
                  }
                  var X = $ === e;
                } else
                  var X = !0;
            }
          }
        } else {
          const O = {
            instancePath: t,
            schemaPath: "#/definitions/CoreThemeReference/type",
            keyword: "type",
            params: { type: "object" },
            message: "must be object"
          };
          i === null ? i = [O] : i.push(O), e++;
        }
      var E = R === e;
      if (h = h || E, !h) {
        const O = e;
        if (e === e)
          if (r && typeof r == "object" && !Array.isArray(r)) {
            let v;
            if (r.resource === void 0 && (v = "resource") || r.slug === void 0 && (v = "slug")) {
              const c = {
                instancePath: t,
                schemaPath: "#/definitions/CorePluginReference/required",
                keyword: "required",
                params: { missingProperty: v },
                message: "must have required property '" + v + "'"
              };
              i === null ? i = [c] : i.push(c), e++;
            } else {
              const c = e;
              for (const N in r)
                if (!(N === "resource" || N === "slug")) {
                  const L = {
                    instancePath: t,
                    schemaPath: "#/definitions/CorePluginReference/additionalProperties",
                    keyword: "additionalProperties",
                    params: { additionalProperty: N },
                    message: "must NOT have additional properties"
                  };
                  i === null ? i = [L] : i.push(L), e++;
                  break;
                }
              if (c === e) {
                if (r.resource !== void 0) {
                  let N = r.resource;
                  const L = e;
                  if (typeof N != "string") {
                    const j = {
                      instancePath: t + "/resource",
                      schemaPath: "#/definitions/CorePluginReference/properties/resource/type",
                      keyword: "type",
                      params: { type: "string" },
                      message: "must be string"
                    };
                    i === null ? i = [j] : i.push(j), e++;
                  }
                  if (N !== "wordpress.org/plugins") {
                    const j = {
                      instancePath: t + "/resource",
                      schemaPath: "#/definitions/CorePluginReference/properties/resource/const",
                      keyword: "const",
                      params: { allowedValue: "wordpress.org/plugins" },
                      message: "must be equal to constant"
                    };
                    i === null ? i = [j] : i.push(j), e++;
                  }
                  var x = L === e;
                } else
                  var x = !0;
                if (x)
                  if (r.slug !== void 0) {
                    const N = e;
                    if (typeof r.slug != "string") {
                      const j = {
                        instancePath: t + "/slug",
                        schemaPath: "#/definitions/CorePluginReference/properties/slug/type",
                        keyword: "type",
                        params: { type: "string" },
                        message: "must be string"
                      };
                      i === null ? i = [j] : i.push(j), e++;
                    }
                    var x = N === e;
                  } else
                    var x = !0;
              }
            }
          } else {
            const v = {
              instancePath: t,
              schemaPath: "#/definitions/CorePluginReference/type",
              keyword: "type",
              params: { type: "object" },
              message: "must be object"
            };
            i === null ? i = [v] : i.push(v), e++;
          }
        var E = O === e;
        if (h = h || E, !h) {
          const v = e;
          if (e === e)
            if (r && typeof r == "object" && !Array.isArray(r)) {
              let L;
              if (r.resource === void 0 && (L = "resource") || r.url === void 0 && (L = "url")) {
                const j = {
                  instancePath: t,
                  schemaPath: "#/definitions/UrlReference/required",
                  keyword: "required",
                  params: { missingProperty: L },
                  message: "must have required property '" + L + "'"
                };
                i === null ? i = [j] : i.push(j), e++;
              } else {
                const j = e;
                for (const M in r)
                  if (!(M === "resource" || M === "url" || M === "caption")) {
                    const q = {
                      instancePath: t,
                      schemaPath: "#/definitions/UrlReference/additionalProperties",
                      keyword: "additionalProperties",
                      params: { additionalProperty: M },
                      message: "must NOT have additional properties"
                    };
                    i === null ? i = [q] : i.push(q), e++;
                    break;
                  }
                if (j === e) {
                  if (r.resource !== void 0) {
                    let M = r.resource;
                    const q = e;
                    if (typeof M != "string") {
                      const H = {
                        instancePath: t + "/resource",
                        schemaPath: "#/definitions/UrlReference/properties/resource/type",
                        keyword: "type",
                        params: { type: "string" },
                        message: "must be string"
                      };
                      i === null ? i = [H] : i.push(H), e++;
                    }
                    if (M !== "url") {
                      const H = {
                        instancePath: t + "/resource",
                        schemaPath: "#/definitions/UrlReference/properties/resource/const",
                        keyword: "const",
                        params: { allowedValue: "url" },
                        message: "must be equal to constant"
                      };
                      i === null ? i = [H] : i.push(H), e++;
                    }
                    var P = q === e;
                  } else
                    var P = !0;
                  if (P) {
                    if (r.url !== void 0) {
                      const M = e;
                      if (typeof r.url != "string") {
                        const H = {
                          instancePath: t + "/url",
                          schemaPath: "#/definitions/UrlReference/properties/url/type",
                          keyword: "type",
                          params: { type: "string" },
                          message: "must be string"
                        };
                        i === null ? i = [H] : i.push(H), e++;
                      }
                      var P = M === e;
                    } else
                      var P = !0;
                    if (P)
                      if (r.caption !== void 0) {
                        const M = e;
                        if (typeof r.caption != "string") {
                          const H = {
                            instancePath: t + "/caption",
                            schemaPath: "#/definitions/UrlReference/properties/caption/type",
                            keyword: "type",
                            params: { type: "string" },
                            message: "must be string"
                          };
                          i === null ? i = [H] : i.push(H), e++;
                        }
                        var P = M === e;
                      } else
                        var P = !0;
                  }
                }
              }
            } else {
              const L = {
                instancePath: t,
                schemaPath: "#/definitions/UrlReference/type",
                keyword: "type",
                params: { type: "object" },
                message: "must be object"
              };
              i === null ? i = [L] : i.push(L), e++;
            }
          var E = v === e;
          h = h || E;
        }
      }
    }
  }
  if (h)
    e = u, i !== null && (u ? i.length = u : i = null);
  else {
    const D = {
      instancePath: t,
      schemaPath: "#/anyOf",
      keyword: "anyOf",
      params: {},
      message: "must match a schema in anyOf"
    };
    return i === null ? i = [D] : i.push(D), e++, ee.errors = i, !1;
  }
  return ee.errors = i, e === 0;
}
const br = {
  type: "object",
  discriminator: { propertyName: "step" },
  required: ["step"],
  oneOf: [
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: { type: "string", const: "activatePlugin" },
        pluginPath: {
          type: "string",
          description: "Path to the plugin directory as absolute path (/wordpress/wp-content/plugins/plugin-name); or the plugin entry file relative to the plugins directory (plugin-name/plugin-name.php)."
        },
        pluginName: {
          type: "string",
          description: "Optional. Plugin name to display in the progress bar."
        }
      },
      required: ["pluginPath", "step"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: { type: "string", const: "activateTheme" },
        themeFolderName: {
          type: "string",
          description: "The name of the theme folder inside wp-content/themes/"
        }
      },
      required: ["step", "themeFolderName"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: { type: "string", const: "cp" },
        fromPath: { type: "string", description: "Source path" },
        toPath: { type: "string", description: "Target path" }
      },
      required: ["fromPath", "step", "toPath"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: { type: "string", const: "defineWpConfigConsts" },
        consts: {
          type: "object",
          additionalProperties: {},
          description: "The constants to define"
        },
        method: {
          type: "string",
          enum: ["rewrite-wp-config", "define-before-run"],
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
      required: ["consts", "step"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: { type: "string", const: "defineSiteUrl" },
        siteUrl: { type: "string", description: "The URL" }
      },
      required: ["siteUrl", "step"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: { type: "string", const: "enableMultisite" }
      },
      required: ["step"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: { type: "string", const: "importWxr" },
        file: {
          $ref: "#/definitions/FileReference",
          description: "The file to import"
        }
      },
      required: ["file", "step"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
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
      required: ["step"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: { type: "string", const: "importWordPressFiles" },
        wordPressFilesZip: {
          $ref: "#/definitions/FileReference",
          description: "The zip file containing the top-level WordPress files and directories."
        },
        pathInZip: {
          type: "string",
          description: "The path inside the zip file where the WordPress files are."
        }
      },
      required: ["step", "wordPressFilesZip"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        ifAlreadyInstalled: {
          type: "string",
          enum: ["overwrite", "skip", "error"],
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
      required: ["pluginZipFile", "step"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        ifAlreadyInstalled: {
          type: "string",
          enum: ["overwrite", "skip", "error"],
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
      required: ["step", "themeZipFile"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: { type: "string", const: "login" },
        username: {
          type: "string",
          description: "The user to log in as. Defaults to 'admin'."
        },
        password: {
          type: "string",
          description: "The password to log in with. Defaults to 'password'."
        }
      },
      required: ["step"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: { type: "string", const: "mkdir" },
        path: {
          type: "string",
          description: "The path of the directory you want to create"
        }
      },
      required: ["path", "step"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: { type: "string", const: "mv" },
        fromPath: { type: "string", description: "Source path" },
        toPath: { type: "string", description: "Target path" }
      },
      required: ["fromPath", "step", "toPath"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: { type: "string", const: "resetData" }
      },
      required: ["step"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: { type: "string", const: "request" },
        request: {
          $ref: "#/definitions/PHPRequest",
          description: "Request details (See /wordpress-playground/api/universal/interface/PHPRequest)"
        }
      },
      required: ["request", "step"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: { type: "string", const: "rm" },
        path: { type: "string", description: "The path to remove" }
      },
      required: ["path", "step"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: { type: "string", const: "rmdir" },
        path: { type: "string", description: "The path to remove" }
      },
      required: ["path", "step"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: {
          type: "string",
          const: "runPHP",
          description: "The step identifier."
        },
        code: { type: "string", description: "The PHP code to run." }
      },
      required: ["code", "step"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: { type: "string", const: "runPHPWithOptions" },
        options: {
          $ref: "#/definitions/PHPRunOptions",
          description: "Run options (See /wordpress-playground/api/universal/interface/PHPRunOptions/))"
        }
      },
      required: ["options", "step"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: { type: "string", const: "runWpInstallationWizard" },
        options: { $ref: "#/definitions/WordPressInstallationOptions" }
      },
      required: ["options", "step"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
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
      required: ["sql", "step"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
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
      required: ["options", "step"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: { type: "string", const: "unzip" },
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
      required: ["extractToPath", "step"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: { type: "string", const: "updateUserMeta" },
        meta: {
          type: "object",
          additionalProperties: {},
          description: 'An object of user meta values to set, e.g. { "first_name": "John" }'
        },
        userId: { type: "number", description: "User ID" }
      },
      required: ["meta", "step", "userId"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: { type: "string", const: "writeFile" },
        path: {
          type: "string",
          description: "The path of the file to write to"
        },
        data: {
          anyOf: [
            { $ref: "#/definitions/FileReference" },
            { type: "string" },
            {
              type: "object",
              properties: {
                BYTES_PER_ELEMENT: { type: "number" },
                buffer: {
                  type: "object",
                  properties: { byteLength: { type: "number" } },
                  required: ["byteLength"],
                  additionalProperties: !1
                },
                byteLength: { type: "number" },
                byteOffset: { type: "number" },
                length: { type: "number" }
              },
              required: [
                "BYTES_PER_ELEMENT",
                "buffer",
                "byteLength",
                "byteOffset",
                "length"
              ],
              additionalProperties: { type: "number" }
            }
          ],
          description: "The data to write"
        }
      },
      required: ["data", "path", "step"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
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
            { type: "string" },
            { type: "array", items: { type: "string" } }
          ],
          description: "The WP CLI command to run."
        },
        wpCliPath: { type: "string", description: "wp-cli.phar path" }
      },
      required: ["command", "step"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: { type: "string", const: "setSiteLanguage" },
        language: {
          type: "string",
          description: "The language to set, e.g. 'en_US'"
        }
      },
      required: ["language", "step"]
    }
  ]
}, yt = {
  type: "string",
  enum: ["GET", "POST", "HEAD", "OPTIONS", "PATCH", "PUT", "DELETE"]
};
function ye(r, { instancePath: t = "", parentData: n, parentDataProperty: p, rootData: l = r } = {}) {
  let i = null, e = 0;
  if (e === 0)
    if (r && typeof r == "object" && !Array.isArray(r)) {
      let X;
      if (r.url === void 0 && (X = "url"))
        return ye.errors = [
          {
            instancePath: t,
            schemaPath: "#/required",
            keyword: "required",
            params: { missingProperty: X },
            message: "must have required property '" + X + "'"
          }
        ], !1;
      {
        const x = e;
        for (const P in r)
          if (!(P === "method" || P === "url" || P === "headers" || P === "body"))
            return ye.errors = [
              {
                instancePath: t,
                schemaPath: "#/additionalProperties",
                keyword: "additionalProperties",
                params: { additionalProperty: P },
                message: "must NOT have additional properties"
              }
            ], !1;
        if (x === e) {
          if (r.method !== void 0) {
            let P = r.method;
            const D = e;
            if (typeof P != "string")
              return ye.errors = [
                {
                  instancePath: t + "/method",
                  schemaPath: "#/definitions/HTTPMethod/type",
                  keyword: "type",
                  params: { type: "string" },
                  message: "must be string"
                }
              ], !1;
            if (!(P === "GET" || P === "POST" || P === "HEAD" || P === "OPTIONS" || P === "PATCH" || P === "PUT" || P === "DELETE"))
              return ye.errors = [
                {
                  instancePath: t + "/method",
                  schemaPath: "#/definitions/HTTPMethod/enum",
                  keyword: "enum",
                  params: { allowedValues: yt.enum },
                  message: "must be equal to one of the allowed values"
                }
              ], !1;
            var u = D === e;
          } else
            var u = !0;
          if (u) {
            if (r.url !== void 0) {
              const P = e;
              if (typeof r.url != "string")
                return ye.errors = [
                  {
                    instancePath: t + "/url",
                    schemaPath: "#/properties/url/type",
                    keyword: "type",
                    params: { type: "string" },
                    message: "must be string"
                  }
                ], !1;
              var u = P === e;
            } else
              var u = !0;
            if (u) {
              if (r.headers !== void 0) {
                let P = r.headers;
                const D = e;
                if (e === e)
                  if (P && typeof P == "object" && !Array.isArray(P))
                    for (const R in P) {
                      const V = e;
                      if (typeof P[R] != "string")
                        return ye.errors = [
                          {
                            instancePath: t + "/headers/" + R.replace(/~/g, "~0").replace(/\//g, "~1"),
                            schemaPath: "#/definitions/PHPRequestHeaders/additionalProperties/type",
                            keyword: "type",
                            params: { type: "string" },
                            message: "must be string"
                          }
                        ], !1;
                      var h = V === e;
                      if (!h)
                        break;
                    }
                  else
                    return ye.errors = [
                      {
                        instancePath: t + "/headers",
                        schemaPath: "#/definitions/PHPRequestHeaders/type",
                        keyword: "type",
                        params: { type: "object" },
                        message: "must be object"
                      }
                    ], !1;
                var u = D === e;
              } else
                var u = !0;
              if (u)
                if (r.body !== void 0) {
                  let P = r.body;
                  const D = e, J = e;
                  let m = !1;
                  const R = e;
                  if (typeof P != "string") {
                    const g = {
                      instancePath: t + "/body",
                      schemaPath: "#/properties/body/anyOf/0/type",
                      keyword: "type",
                      params: { type: "string" },
                      message: "must be string"
                    };
                    i === null ? i = [g] : i.push(g), e++;
                  }
                  var b = R === e;
                  if (m = m || b, !m) {
                    const g = e;
                    if (e === g)
                      if (P && typeof P == "object" && !Array.isArray(P)) {
                        let w;
                        if (P.BYTES_PER_ELEMENT === void 0 && (w = "BYTES_PER_ELEMENT") || P.buffer === void 0 && (w = "buffer") || P.byteLength === void 0 && (w = "byteLength") || P.byteOffset === void 0 && (w = "byteOffset") || P.length === void 0 && (w = "length")) {
                          const $ = {
                            instancePath: t + "/body",
                            schemaPath: "#/properties/body/anyOf/1/required",
                            keyword: "required",
                            params: { missingProperty: w },
                            message: "must have required property '" + w + "'"
                          };
                          i === null ? i = [$] : i.push($), e++;
                        } else {
                          const $ = e;
                          for (const v in P)
                            if (!(v === "BYTES_PER_ELEMENT" || v === "buffer" || v === "byteLength" || v === "byteOffset" || v === "length")) {
                              let c = P[v];
                              const N = e;
                              if (!(typeof c == "number" && isFinite(c))) {
                                const L = {
                                  instancePath: t + "/body/" + v.replace(/~/g, "~0").replace(/\//g, "~1"),
                                  schemaPath: "#/properties/body/anyOf/1/additionalProperties/type",
                                  keyword: "type",
                                  params: { type: "number" },
                                  message: "must be number"
                                };
                                i === null ? i = [L] : i.push(L), e++;
                              }
                              var k = N === e;
                              if (!k)
                                break;
                            }
                          if ($ === e) {
                            if (P.BYTES_PER_ELEMENT !== void 0) {
                              let v = P.BYTES_PER_ELEMENT;
                              const c = e;
                              if (!(typeof v == "number" && isFinite(v))) {
                                const N = {
                                  instancePath: t + "/body/BYTES_PER_ELEMENT",
                                  schemaPath: "#/properties/body/anyOf/1/properties/BYTES_PER_ELEMENT/type",
                                  keyword: "type",
                                  params: { type: "number" },
                                  message: "must be number"
                                };
                                i === null ? i = [N] : i.push(N), e++;
                              }
                              var y = c === e;
                            } else
                              var y = !0;
                            if (y) {
                              if (P.buffer !== void 0) {
                                let v = P.buffer;
                                const c = e;
                                if (e === c)
                                  if (v && typeof v == "object" && !Array.isArray(v)) {
                                    let L;
                                    if (v.byteLength === void 0 && (L = "byteLength")) {
                                      const j = {
                                        instancePath: t + "/body/buffer",
                                        schemaPath: "#/properties/body/anyOf/1/properties/buffer/required",
                                        keyword: "required",
                                        params: { missingProperty: L },
                                        message: "must have required property '" + L + "'"
                                      };
                                      i === null ? i = [j] : i.push(j), e++;
                                    } else {
                                      const j = e;
                                      for (const M in v)
                                        if (M !== "byteLength") {
                                          const q = {
                                            instancePath: t + "/body/buffer",
                                            schemaPath: "#/properties/body/anyOf/1/properties/buffer/additionalProperties",
                                            keyword: "additionalProperties",
                                            params: {
                                              additionalProperty: M
                                            },
                                            message: "must NOT have additional properties"
                                          };
                                          i === null ? i = [q] : i.push(q), e++;
                                          break;
                                        }
                                      if (j === e && v.byteLength !== void 0) {
                                        let M = v.byteLength;
                                        if (!(typeof M == "number" && isFinite(M))) {
                                          const q = {
                                            instancePath: t + "/body/buffer/byteLength",
                                            schemaPath: "#/properties/body/anyOf/1/properties/buffer/properties/byteLength/type",
                                            keyword: "type",
                                            params: { type: "number" },
                                            message: "must be number"
                                          };
                                          i === null ? i = [q] : i.push(q), e++;
                                        }
                                      }
                                    }
                                  } else {
                                    const L = {
                                      instancePath: t + "/body/buffer",
                                      schemaPath: "#/properties/body/anyOf/1/properties/buffer/type",
                                      keyword: "type",
                                      params: { type: "object" },
                                      message: "must be object"
                                    };
                                    i === null ? i = [L] : i.push(L), e++;
                                  }
                                var y = c === e;
                              } else
                                var y = !0;
                              if (y) {
                                if (P.byteLength !== void 0) {
                                  let v = P.byteLength;
                                  const c = e;
                                  if (!(typeof v == "number" && isFinite(v))) {
                                    const L = {
                                      instancePath: t + "/body/byteLength",
                                      schemaPath: "#/properties/body/anyOf/1/properties/byteLength/type",
                                      keyword: "type",
                                      params: { type: "number" },
                                      message: "must be number"
                                    };
                                    i === null ? i = [L] : i.push(L), e++;
                                  }
                                  var y = c === e;
                                } else
                                  var y = !0;
                                if (y) {
                                  if (P.byteOffset !== void 0) {
                                    let v = P.byteOffset;
                                    const c = e;
                                    if (!(typeof v == "number" && isFinite(v))) {
                                      const L = {
                                        instancePath: t + "/body/byteOffset",
                                        schemaPath: "#/properties/body/anyOf/1/properties/byteOffset/type",
                                        keyword: "type",
                                        params: { type: "number" },
                                        message: "must be number"
                                      };
                                      i === null ? i = [L] : i.push(L), e++;
                                    }
                                    var y = c === e;
                                  } else
                                    var y = !0;
                                  if (y)
                                    if (P.length !== void 0) {
                                      let v = P.length;
                                      const c = e;
                                      if (!(typeof v == "number" && isFinite(v))) {
                                        const L = {
                                          instancePath: t + "/body/length",
                                          schemaPath: "#/properties/body/anyOf/1/properties/length/type",
                                          keyword: "type",
                                          params: { type: "number" },
                                          message: "must be number"
                                        };
                                        i === null ? i = [L] : i.push(L), e++;
                                      }
                                      var y = c === e;
                                    } else
                                      var y = !0;
                                }
                              }
                            }
                          }
                        }
                      } else {
                        const w = {
                          instancePath: t + "/body",
                          schemaPath: "#/properties/body/anyOf/1/type",
                          keyword: "type",
                          params: { type: "object" },
                          message: "must be object"
                        };
                        i === null ? i = [w] : i.push(w), e++;
                      }
                    var b = g === e;
                    if (m = m || b, !m) {
                      const w = e;
                      if (e === w)
                        if (P && typeof P == "object" && !Array.isArray(P))
                          for (const v in P) {
                            let c = P[v];
                            const N = e, L = e;
                            let j = !1;
                            const M = e;
                            if (typeof c != "string") {
                              const q = {
                                instancePath: t + "/body/" + v.replace(/~/g, "~0").replace(/\//g, "~1"),
                                schemaPath: "#/properties/body/anyOf/2/additionalProperties/anyOf/0/type",
                                keyword: "type",
                                params: { type: "string" },
                                message: "must be string"
                              };
                              i === null ? i = [q] : i.push(q), e++;
                            }
                            var E = M === e;
                            if (j = j || E, !j) {
                              const q = e;
                              if (e === q)
                                if (c && typeof c == "object" && !Array.isArray(c)) {
                                  let te;
                                  if (c.BYTES_PER_ELEMENT === void 0 && (te = "BYTES_PER_ELEMENT") || c.buffer === void 0 && (te = "buffer") || c.byteLength === void 0 && (te = "byteLength") || c.byteOffset === void 0 && (te = "byteOffset") || c.length === void 0 && (te = "length")) {
                                    const Z = {
                                      instancePath: t + "/body/" + v.replace(/~/g, "~0").replace(/\//g, "~1"),
                                      schemaPath: "#/properties/body/anyOf/2/additionalProperties/anyOf/1/required",
                                      keyword: "required",
                                      params: { missingProperty: te },
                                      message: "must have required property '" + te + "'"
                                    };
                                    i === null ? i = [Z] : i.push(Z), e++;
                                  } else {
                                    const Z = e;
                                    for (const C in c)
                                      if (!(C === "BYTES_PER_ELEMENT" || C === "buffer" || C === "byteLength" || C === "byteOffset" || C === "length")) {
                                        let U = c[C];
                                        const z = e;
                                        if (!(typeof U == "number" && isFinite(U))) {
                                          const G = {
                                            instancePath: t + "/body/" + v.replace(/~/g, "~0").replace(/\//g, "~1") + "/" + C.replace(/~/g, "~0").replace(/\//g, "~1"),
                                            schemaPath: "#/properties/body/anyOf/2/additionalProperties/anyOf/1/additionalProperties/type",
                                            keyword: "type",
                                            params: { type: "number" },
                                            message: "must be number"
                                          };
                                          i === null ? i = [G] : i.push(G), e++;
                                        }
                                        var S = z === e;
                                        if (!S)
                                          break;
                                      }
                                    if (Z === e) {
                                      if (c.BYTES_PER_ELEMENT !== void 0) {
                                        let C = c.BYTES_PER_ELEMENT;
                                        const U = e;
                                        if (!(typeof C == "number" && isFinite(C))) {
                                          const z = {
                                            instancePath: t + "/body/" + v.replace(/~/g, "~0").replace(/\//g, "~1") + "/BYTES_PER_ELEMENT",
                                            schemaPath: "#/properties/body/anyOf/2/additionalProperties/anyOf/1/properties/BYTES_PER_ELEMENT/type",
                                            keyword: "type",
                                            params: { type: "number" },
                                            message: "must be number"
                                          };
                                          i === null ? i = [z] : i.push(z), e++;
                                        }
                                        var I = U === e;
                                      } else
                                        var I = !0;
                                      if (I) {
                                        if (c.buffer !== void 0) {
                                          let C = c.buffer;
                                          const U = e;
                                          if (e === U)
                                            if (C && typeof C == "object" && !Array.isArray(C)) {
                                              let G;
                                              if (C.byteLength === void 0 && (G = "byteLength")) {
                                                const re = {
                                                  instancePath: t + "/body/" + v.replace(/~/g, "~0").replace(/\//g, "~1") + "/buffer",
                                                  schemaPath: "#/properties/body/anyOf/2/additionalProperties/anyOf/1/properties/buffer/required",
                                                  keyword: "required",
                                                  params: {
                                                    missingProperty: G
                                                  },
                                                  message: "must have required property '" + G + "'"
                                                };
                                                i === null ? i = [re] : i.push(re), e++;
                                              } else {
                                                const re = e;
                                                for (const pe in C)
                                                  if (pe !== "byteLength") {
                                                    const le = {
                                                      instancePath: t + "/body/" + v.replace(/~/g, "~0").replace(
                                                        /\//g,
                                                        "~1"
                                                      ) + "/buffer",
                                                      schemaPath: "#/properties/body/anyOf/2/additionalProperties/anyOf/1/properties/buffer/additionalProperties",
                                                      keyword: "additionalProperties",
                                                      params: {
                                                        additionalProperty: pe
                                                      },
                                                      message: "must NOT have additional properties"
                                                    };
                                                    i === null ? i = [le] : i.push(le), e++;
                                                    break;
                                                  }
                                                if (re === e && C.byteLength !== void 0) {
                                                  let pe = C.byteLength;
                                                  if (!(typeof pe == "number" && isFinite(pe))) {
                                                    const le = {
                                                      instancePath: t + "/body/" + v.replace(/~/g, "~0").replace(
                                                        /\//g,
                                                        "~1"
                                                      ) + "/buffer/byteLength",
                                                      schemaPath: "#/properties/body/anyOf/2/additionalProperties/anyOf/1/properties/buffer/properties/byteLength/type",
                                                      keyword: "type",
                                                      params: {
                                                        type: "number"
                                                      },
                                                      message: "must be number"
                                                    };
                                                    i === null ? i = [le] : i.push(le), e++;
                                                  }
                                                }
                                              }
                                            } else {
                                              const G = {
                                                instancePath: t + "/body/" + v.replace(/~/g, "~0").replace(/\//g, "~1") + "/buffer",
                                                schemaPath: "#/properties/body/anyOf/2/additionalProperties/anyOf/1/properties/buffer/type",
                                                keyword: "type",
                                                params: { type: "object" },
                                                message: "must be object"
                                              };
                                              i === null ? i = [G] : i.push(G), e++;
                                            }
                                          var I = U === e;
                                        } else
                                          var I = !0;
                                        if (I) {
                                          if (c.byteLength !== void 0) {
                                            let C = c.byteLength;
                                            const U = e;
                                            if (!(typeof C == "number" && isFinite(C))) {
                                              const G = {
                                                instancePath: t + "/body/" + v.replace(/~/g, "~0").replace(/\//g, "~1") + "/byteLength",
                                                schemaPath: "#/properties/body/anyOf/2/additionalProperties/anyOf/1/properties/byteLength/type",
                                                keyword: "type",
                                                params: { type: "number" },
                                                message: "must be number"
                                              };
                                              i === null ? i = [G] : i.push(G), e++;
                                            }
                                            var I = U === e;
                                          } else
                                            var I = !0;
                                          if (I) {
                                            if (c.byteOffset !== void 0) {
                                              let C = c.byteOffset;
                                              const U = e;
                                              if (!(typeof C == "number" && isFinite(C))) {
                                                const G = {
                                                  instancePath: t + "/body/" + v.replace(/~/g, "~0").replace(/\//g, "~1") + "/byteOffset",
                                                  schemaPath: "#/properties/body/anyOf/2/additionalProperties/anyOf/1/properties/byteOffset/type",
                                                  keyword: "type",
                                                  params: { type: "number" },
                                                  message: "must be number"
                                                };
                                                i === null ? i = [G] : i.push(G), e++;
                                              }
                                              var I = U === e;
                                            } else
                                              var I = !0;
                                            if (I)
                                              if (c.length !== void 0) {
                                                let C = c.length;
                                                const U = e;
                                                if (!(typeof C == "number" && isFinite(C))) {
                                                  const G = {
                                                    instancePath: t + "/body/" + v.replace(/~/g, "~0").replace(/\//g, "~1") + "/length",
                                                    schemaPath: "#/properties/body/anyOf/2/additionalProperties/anyOf/1/properties/length/type",
                                                    keyword: "type",
                                                    params: { type: "number" },
                                                    message: "must be number"
                                                  };
                                                  i === null ? i = [G] : i.push(G), e++;
                                                }
                                                var I = U === e;
                                              } else
                                                var I = !0;
                                          }
                                        }
                                      }
                                    }
                                  }
                                } else {
                                  const te = {
                                    instancePath: t + "/body/" + v.replace(/~/g, "~0").replace(/\//g, "~1"),
                                    schemaPath: "#/properties/body/anyOf/2/additionalProperties/anyOf/1/type",
                                    keyword: "type",
                                    params: { type: "object" },
                                    message: "must be object"
                                  };
                                  i === null ? i = [te] : i.push(te), e++;
                                }
                              var E = q === e;
                              if (j = j || E, !j) {
                                const te = e;
                                if (e === te)
                                  if (c && typeof c == "object" && !Array.isArray(c)) {
                                    let C;
                                    if (c.lastModified === void 0 && (C = "lastModified") || c.name === void 0 && (C = "name") || c.size === void 0 && (C = "size") || c.type === void 0 && (C = "type") || c.webkitRelativePath === void 0 && (C = "webkitRelativePath")) {
                                      const U = {
                                        instancePath: t + "/body/" + v.replace(/~/g, "~0").replace(/\//g, "~1"),
                                        schemaPath: "#/properties/body/anyOf/2/additionalProperties/anyOf/2/required",
                                        keyword: "required",
                                        params: { missingProperty: C },
                                        message: "must have required property '" + C + "'"
                                      };
                                      i === null ? i = [U] : i.push(U), e++;
                                    } else {
                                      const U = e;
                                      for (const z in c)
                                        if (!(z === "size" || z === "type" || z === "lastModified" || z === "name" || z === "webkitRelativePath")) {
                                          const G = {
                                            instancePath: t + "/body/" + v.replace(/~/g, "~0").replace(/\//g, "~1"),
                                            schemaPath: "#/properties/body/anyOf/2/additionalProperties/anyOf/2/additionalProperties",
                                            keyword: "additionalProperties",
                                            params: {
                                              additionalProperty: z
                                            },
                                            message: "must NOT have additional properties"
                                          };
                                          i === null ? i = [G] : i.push(G), e++;
                                          break;
                                        }
                                      if (U === e) {
                                        if (c.size !== void 0) {
                                          let z = c.size;
                                          const G = e;
                                          if (!(typeof z == "number" && isFinite(z))) {
                                            const re = {
                                              instancePath: t + "/body/" + v.replace(/~/g, "~0").replace(/\//g, "~1") + "/size",
                                              schemaPath: "#/properties/body/anyOf/2/additionalProperties/anyOf/2/properties/size/type",
                                              keyword: "type",
                                              params: { type: "number" },
                                              message: "must be number"
                                            };
                                            i === null ? i = [re] : i.push(re), e++;
                                          }
                                          var _ = G === e;
                                        } else
                                          var _ = !0;
                                        if (_) {
                                          if (c.type !== void 0) {
                                            const z = e;
                                            if (typeof c.type != "string") {
                                              const re = {
                                                instancePath: t + "/body/" + v.replace(/~/g, "~0").replace(/\//g, "~1") + "/type",
                                                schemaPath: "#/properties/body/anyOf/2/additionalProperties/anyOf/2/properties/type/type",
                                                keyword: "type",
                                                params: { type: "string" },
                                                message: "must be string"
                                              };
                                              i === null ? i = [re] : i.push(re), e++;
                                            }
                                            var _ = z === e;
                                          } else
                                            var _ = !0;
                                          if (_) {
                                            if (c.lastModified !== void 0) {
                                              let z = c.lastModified;
                                              const G = e;
                                              if (!(typeof z == "number" && isFinite(z))) {
                                                const pe = {
                                                  instancePath: t + "/body/" + v.replace(/~/g, "~0").replace(/\//g, "~1") + "/lastModified",
                                                  schemaPath: "#/properties/body/anyOf/2/additionalProperties/anyOf/2/properties/lastModified/type",
                                                  keyword: "type",
                                                  params: { type: "number" },
                                                  message: "must be number"
                                                };
                                                i === null ? i = [pe] : i.push(pe), e++;
                                              }
                                              var _ = G === e;
                                            } else
                                              var _ = !0;
                                            if (_) {
                                              if (c.name !== void 0) {
                                                const z = e;
                                                if (typeof c.name != "string") {
                                                  const re = {
                                                    instancePath: t + "/body/" + v.replace(/~/g, "~0").replace(/\//g, "~1") + "/name",
                                                    schemaPath: "#/properties/body/anyOf/2/additionalProperties/anyOf/2/properties/name/type",
                                                    keyword: "type",
                                                    params: { type: "string" },
                                                    message: "must be string"
                                                  };
                                                  i === null ? i = [re] : i.push(re), e++;
                                                }
                                                var _ = z === e;
                                              } else
                                                var _ = !0;
                                              if (_)
                                                if (c.webkitRelativePath !== void 0) {
                                                  const z = e;
                                                  if (typeof c.webkitRelativePath != "string") {
                                                    const re = {
                                                      instancePath: t + "/body/" + v.replace(/~/g, "~0").replace(
                                                        /\//g,
                                                        "~1"
                                                      ) + "/webkitRelativePath",
                                                      schemaPath: "#/properties/body/anyOf/2/additionalProperties/anyOf/2/properties/webkitRelativePath/type",
                                                      keyword: "type",
                                                      params: {
                                                        type: "string"
                                                      },
                                                      message: "must be string"
                                                    };
                                                    i === null ? i = [re] : i.push(re), e++;
                                                  }
                                                  var _ = z === e;
                                                } else
                                                  var _ = !0;
                                            }
                                          }
                                        }
                                      }
                                    }
                                  } else {
                                    const C = {
                                      instancePath: t + "/body/" + v.replace(/~/g, "~0").replace(/\//g, "~1"),
                                      schemaPath: "#/properties/body/anyOf/2/additionalProperties/anyOf/2/type",
                                      keyword: "type",
                                      params: { type: "object" },
                                      message: "must be object"
                                    };
                                    i === null ? i = [C] : i.push(C), e++;
                                  }
                                var E = te === e;
                                j = j || E;
                              }
                            }
                            if (j)
                              e = L, i !== null && (L ? i.length = L : i = null);
                            else {
                              const q = {
                                instancePath: t + "/body/" + v.replace(/~/g, "~0").replace(/\//g, "~1"),
                                schemaPath: "#/properties/body/anyOf/2/additionalProperties/anyOf",
                                keyword: "anyOf",
                                params: {},
                                message: "must match a schema in anyOf"
                              };
                              i === null ? i = [q] : i.push(q), e++;
                            }
                            var W = N === e;
                            if (!W)
                              break;
                          }
                        else {
                          const v = {
                            instancePath: t + "/body",
                            schemaPath: "#/properties/body/anyOf/2/type",
                            keyword: "type",
                            params: { type: "object" },
                            message: "must be object"
                          };
                          i === null ? i = [v] : i.push(v), e++;
                        }
                      var b = w === e;
                      m = m || b;
                    }
                  }
                  if (m)
                    e = J, i !== null && (J ? i.length = J : i = null);
                  else {
                    const g = {
                      instancePath: t + "/body",
                      schemaPath: "#/properties/body/anyOf",
                      keyword: "anyOf",
                      params: {},
                      message: "must match a schema in anyOf"
                    };
                    return i === null ? i = [g] : i.push(g), e++, ye.errors = i, !1;
                  }
                  var u = D === e;
                } else
                  var u = !0;
            }
          }
        }
      }
    } else
      return ye.errors = [
        {
          instancePath: t,
          schemaPath: "#/type",
          keyword: "type",
          params: { type: "object" },
          message: "must be object"
        }
      ], !1;
  return ye.errors = i, e === 0;
}
const xs = {
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
    protocol: { type: "string", description: "Request protocol." },
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
        { type: "string" },
        {
          type: "object",
          properties: {
            BYTES_PER_ELEMENT: { type: "number" },
            buffer: {
              type: "object",
              properties: { byteLength: { type: "number" } },
              required: ["byteLength"],
              additionalProperties: !1
            },
            byteLength: { type: "number" },
            byteOffset: { type: "number" },
            length: { type: "number" }
          },
          required: [
            "BYTES_PER_ELEMENT",
            "buffer",
            "byteLength",
            "byteOffset",
            "length"
          ],
          additionalProperties: { type: "number" }
        }
      ],
      description: "Request body."
    },
    env: {
      type: "object",
      additionalProperties: { type: "string" },
      description: "Environment variables to set for this run."
    },
    $_SERVER: {
      type: "object",
      additionalProperties: { type: "string" },
      description: "$_SERVER entries to set for this run."
    },
    code: {
      type: "string",
      description: "The code snippet to eval instead of a php file."
    }
  },
  additionalProperties: !1
};
function ne(r, { instancePath: t = "", parentData: n, parentDataProperty: p, rootData: l = r } = {}) {
  let i = null, e = 0;
  if (e === 0)
    if (r && typeof r == "object" && !Array.isArray(r)) {
      const I = e;
      for (const _ in r)
        if (!mt.call(xs.properties, _))
          return ne.errors = [
            {
              instancePath: t,
              schemaPath: "#/additionalProperties",
              keyword: "additionalProperties",
              params: { additionalProperty: _ },
              message: "must NOT have additional properties"
            }
          ], !1;
      if (I === e) {
        if (r.relativeUri !== void 0) {
          const _ = e;
          if (typeof r.relativeUri != "string")
            return ne.errors = [
              {
                instancePath: t + "/relativeUri",
                schemaPath: "#/properties/relativeUri/type",
                keyword: "type",
                params: { type: "string" },
                message: "must be string"
              }
            ], !1;
          var u = _ === e;
        } else
          var u = !0;
        if (u) {
          if (r.scriptPath !== void 0) {
            const _ = e;
            if (typeof r.scriptPath != "string")
              return ne.errors = [
                {
                  instancePath: t + "/scriptPath",
                  schemaPath: "#/properties/scriptPath/type",
                  keyword: "type",
                  params: { type: "string" },
                  message: "must be string"
                }
              ], !1;
            var u = _ === e;
          } else
            var u = !0;
          if (u) {
            if (r.protocol !== void 0) {
              const _ = e;
              if (typeof r.protocol != "string")
                return ne.errors = [
                  {
                    instancePath: t + "/protocol",
                    schemaPath: "#/properties/protocol/type",
                    keyword: "type",
                    params: { type: "string" },
                    message: "must be string"
                  }
                ], !1;
              var u = _ === e;
            } else
              var u = !0;
            if (u) {
              if (r.method !== void 0) {
                let _ = r.method;
                const W = e;
                if (typeof _ != "string")
                  return ne.errors = [
                    {
                      instancePath: t + "/method",
                      schemaPath: "#/definitions/HTTPMethod/type",
                      keyword: "type",
                      params: { type: "string" },
                      message: "must be string"
                    }
                  ], !1;
                if (!(_ === "GET" || _ === "POST" || _ === "HEAD" || _ === "OPTIONS" || _ === "PATCH" || _ === "PUT" || _ === "DELETE"))
                  return ne.errors = [
                    {
                      instancePath: t + "/method",
                      schemaPath: "#/definitions/HTTPMethod/enum",
                      keyword: "enum",
                      params: { allowedValues: yt.enum },
                      message: "must be equal to one of the allowed values"
                    }
                  ], !1;
                var u = W === e;
              } else
                var u = !0;
              if (u) {
                if (r.headers !== void 0) {
                  let _ = r.headers;
                  const W = e;
                  if (e === e)
                    if (_ && typeof _ == "object" && !Array.isArray(_))
                      for (const P in _) {
                        const D = e;
                        if (typeof _[P] != "string")
                          return ne.errors = [
                            {
                              instancePath: t + "/headers/" + P.replace(/~/g, "~0").replace(/\//g, "~1"),
                              schemaPath: "#/definitions/PHPRequestHeaders/additionalProperties/type",
                              keyword: "type",
                              params: { type: "string" },
                              message: "must be string"
                            }
                          ], !1;
                        var h = D === e;
                        if (!h)
                          break;
                      }
                    else
                      return ne.errors = [
                        {
                          instancePath: t + "/headers",
                          schemaPath: "#/definitions/PHPRequestHeaders/type",
                          keyword: "type",
                          params: { type: "object" },
                          message: "must be object"
                        }
                      ], !1;
                  var u = W === e;
                } else
                  var u = !0;
                if (u) {
                  if (r.body !== void 0) {
                    let _ = r.body;
                    const W = e, X = e;
                    let x = !1;
                    const P = e;
                    if (typeof _ != "string") {
                      const J = {
                        instancePath: t + "/body",
                        schemaPath: "#/properties/body/anyOf/0/type",
                        keyword: "type",
                        params: { type: "string" },
                        message: "must be string"
                      };
                      i === null ? i = [J] : i.push(J), e++;
                    }
                    var b = P === e;
                    if (x = x || b, !x) {
                      const J = e;
                      if (e === J)
                        if (_ && typeof _ == "object" && !Array.isArray(_)) {
                          let R;
                          if (_.BYTES_PER_ELEMENT === void 0 && (R = "BYTES_PER_ELEMENT") || _.buffer === void 0 && (R = "buffer") || _.byteLength === void 0 && (R = "byteLength") || _.byteOffset === void 0 && (R = "byteOffset") || _.length === void 0 && (R = "length")) {
                            const V = {
                              instancePath: t + "/body",
                              schemaPath: "#/properties/body/anyOf/1/required",
                              keyword: "required",
                              params: { missingProperty: R },
                              message: "must have required property '" + R + "'"
                            };
                            i === null ? i = [V] : i.push(V), e++;
                          } else {
                            const V = e;
                            for (const g in _)
                              if (!(g === "BYTES_PER_ELEMENT" || g === "buffer" || g === "byteLength" || g === "byteOffset" || g === "length")) {
                                let O = _[g];
                                const w = e;
                                if (!(typeof O == "number" && isFinite(O))) {
                                  const $ = {
                                    instancePath: t + "/body/" + g.replace(/~/g, "~0").replace(/\//g, "~1"),
                                    schemaPath: "#/properties/body/anyOf/1/additionalProperties/type",
                                    keyword: "type",
                                    params: { type: "number" },
                                    message: "must be number"
                                  };
                                  i === null ? i = [$] : i.push($), e++;
                                }
                                var k = w === e;
                                if (!k)
                                  break;
                              }
                            if (V === e) {
                              if (_.BYTES_PER_ELEMENT !== void 0) {
                                let g = _.BYTES_PER_ELEMENT;
                                const O = e;
                                if (!(typeof g == "number" && isFinite(g))) {
                                  const w = {
                                    instancePath: t + "/body/BYTES_PER_ELEMENT",
                                    schemaPath: "#/properties/body/anyOf/1/properties/BYTES_PER_ELEMENT/type",
                                    keyword: "type",
                                    params: { type: "number" },
                                    message: "must be number"
                                  };
                                  i === null ? i = [w] : i.push(w), e++;
                                }
                                var y = O === e;
                              } else
                                var y = !0;
                              if (y) {
                                if (_.buffer !== void 0) {
                                  let g = _.buffer;
                                  const O = e;
                                  if (e === O)
                                    if (g && typeof g == "object" && !Array.isArray(g)) {
                                      let $;
                                      if (g.byteLength === void 0 && ($ = "byteLength")) {
                                        const v = {
                                          instancePath: t + "/body/buffer",
                                          schemaPath: "#/properties/body/anyOf/1/properties/buffer/required",
                                          keyword: "required",
                                          params: { missingProperty: $ },
                                          message: "must have required property '" + $ + "'"
                                        };
                                        i === null ? i = [v] : i.push(v), e++;
                                      } else {
                                        const v = e;
                                        for (const c in g)
                                          if (c !== "byteLength") {
                                            const N = {
                                              instancePath: t + "/body/buffer",
                                              schemaPath: "#/properties/body/anyOf/1/properties/buffer/additionalProperties",
                                              keyword: "additionalProperties",
                                              params: {
                                                additionalProperty: c
                                              },
                                              message: "must NOT have additional properties"
                                            };
                                            i === null ? i = [N] : i.push(N), e++;
                                            break;
                                          }
                                        if (v === e && g.byteLength !== void 0) {
                                          let c = g.byteLength;
                                          if (!(typeof c == "number" && isFinite(c))) {
                                            const N = {
                                              instancePath: t + "/body/buffer/byteLength",
                                              schemaPath: "#/properties/body/anyOf/1/properties/buffer/properties/byteLength/type",
                                              keyword: "type",
                                              params: { type: "number" },
                                              message: "must be number"
                                            };
                                            i === null ? i = [N] : i.push(N), e++;
                                          }
                                        }
                                      }
                                    } else {
                                      const $ = {
                                        instancePath: t + "/body/buffer",
                                        schemaPath: "#/properties/body/anyOf/1/properties/buffer/type",
                                        keyword: "type",
                                        params: { type: "object" },
                                        message: "must be object"
                                      };
                                      i === null ? i = [$] : i.push($), e++;
                                    }
                                  var y = O === e;
                                } else
                                  var y = !0;
                                if (y) {
                                  if (_.byteLength !== void 0) {
                                    let g = _.byteLength;
                                    const O = e;
                                    if (!(typeof g == "number" && isFinite(g))) {
                                      const $ = {
                                        instancePath: t + "/body/byteLength",
                                        schemaPath: "#/properties/body/anyOf/1/properties/byteLength/type",
                                        keyword: "type",
                                        params: { type: "number" },
                                        message: "must be number"
                                      };
                                      i === null ? i = [$] : i.push($), e++;
                                    }
                                    var y = O === e;
                                  } else
                                    var y = !0;
                                  if (y) {
                                    if (_.byteOffset !== void 0) {
                                      let g = _.byteOffset;
                                      const O = e;
                                      if (!(typeof g == "number" && isFinite(g))) {
                                        const $ = {
                                          instancePath: t + "/body/byteOffset",
                                          schemaPath: "#/properties/body/anyOf/1/properties/byteOffset/type",
                                          keyword: "type",
                                          params: { type: "number" },
                                          message: "must be number"
                                        };
                                        i === null ? i = [$] : i.push($), e++;
                                      }
                                      var y = O === e;
                                    } else
                                      var y = !0;
                                    if (y)
                                      if (_.length !== void 0) {
                                        let g = _.length;
                                        const O = e;
                                        if (!(typeof g == "number" && isFinite(g))) {
                                          const $ = {
                                            instancePath: t + "/body/length",
                                            schemaPath: "#/properties/body/anyOf/1/properties/length/type",
                                            keyword: "type",
                                            params: { type: "number" },
                                            message: "must be number"
                                          };
                                          i === null ? i = [$] : i.push($), e++;
                                        }
                                        var y = O === e;
                                      } else
                                        var y = !0;
                                  }
                                }
                              }
                            }
                          }
                        } else {
                          const R = {
                            instancePath: t + "/body",
                            schemaPath: "#/properties/body/anyOf/1/type",
                            keyword: "type",
                            params: { type: "object" },
                            message: "must be object"
                          };
                          i === null ? i = [R] : i.push(R), e++;
                        }
                      var b = J === e;
                      x = x || b;
                    }
                    if (x)
                      e = X, i !== null && (X ? i.length = X : i = null);
                    else {
                      const J = {
                        instancePath: t + "/body",
                        schemaPath: "#/properties/body/anyOf",
                        keyword: "anyOf",
                        params: {},
                        message: "must match a schema in anyOf"
                      };
                      return i === null ? i = [J] : i.push(J), e++, ne.errors = i, !1;
                    }
                    var u = W === e;
                  } else
                    var u = !0;
                  if (u) {
                    if (r.env !== void 0) {
                      let _ = r.env;
                      const W = e;
                      if (e === W)
                        if (_ && typeof _ == "object" && !Array.isArray(_))
                          for (const x in _) {
                            const P = e;
                            if (typeof _[x] != "string")
                              return ne.errors = [
                                {
                                  instancePath: t + "/env/" + x.replace(/~/g, "~0").replace(/\//g, "~1"),
                                  schemaPath: "#/properties/env/additionalProperties/type",
                                  keyword: "type",
                                  params: { type: "string" },
                                  message: "must be string"
                                }
                              ], !1;
                            var E = P === e;
                            if (!E)
                              break;
                          }
                        else
                          return ne.errors = [
                            {
                              instancePath: t + "/env",
                              schemaPath: "#/properties/env/type",
                              keyword: "type",
                              params: { type: "object" },
                              message: "must be object"
                            }
                          ], !1;
                      var u = W === e;
                    } else
                      var u = !0;
                    if (u) {
                      if (r.$_SERVER !== void 0) {
                        let _ = r.$_SERVER;
                        const W = e;
                        if (e === W)
                          if (_ && typeof _ == "object" && !Array.isArray(_))
                            for (const x in _) {
                              const P = e;
                              if (typeof _[x] != "string")
                                return ne.errors = [
                                  {
                                    instancePath: t + "/$_SERVER/" + x.replace(/~/g, "~0").replace(/\//g, "~1"),
                                    schemaPath: "#/properties/%24_SERVER/additionalProperties/type",
                                    keyword: "type",
                                    params: { type: "string" },
                                    message: "must be string"
                                  }
                                ], !1;
                              var S = P === e;
                              if (!S)
                                break;
                            }
                          else
                            return ne.errors = [
                              {
                                instancePath: t + "/$_SERVER",
                                schemaPath: "#/properties/%24_SERVER/type",
                                keyword: "type",
                                params: { type: "object" },
                                message: "must be object"
                              }
                            ], !1;
                        var u = W === e;
                      } else
                        var u = !0;
                      if (u)
                        if (r.code !== void 0) {
                          const _ = e;
                          if (typeof r.code != "string")
                            return ne.errors = [
                              {
                                instancePath: t + "/code",
                                schemaPath: "#/properties/code/type",
                                keyword: "type",
                                params: { type: "string" },
                                message: "must be string"
                              }
                            ], !1;
                          var u = _ === e;
                        } else
                          var u = !0;
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else
      return ne.errors = [
        {
          instancePath: t,
          schemaPath: "#/type",
          keyword: "type",
          params: { type: "object" },
          message: "must be object"
        }
      ], !1;
  return ne.errors = i, e === 0;
}
function o(r, { instancePath: t = "", parentData: n, parentDataProperty: p, rootData: l = r } = {}) {
  let i = null, e = 0;
  if (e === 0)
    if (r && typeof r == "object" && !Array.isArray(r)) {
      let cr;
      if (r.step === void 0 && (cr = "step"))
        return o.errors = [
          {
            instancePath: t,
            schemaPath: "#/required",
            keyword: "required",
            params: { missingProperty: cr },
            message: "must have required property '" + cr + "'"
          }
        ], !1;
      {
        const Y = r.step;
        if (typeof Y == "string")
          if (Y === "activatePlugin") {
            if (e === e)
              if (r && typeof r == "object" && !Array.isArray(r)) {
                let d;
                if (r.pluginPath === void 0 && (d = "pluginPath") || r.step === void 0 && (d = "step"))
                  return o.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/0/required",
                      keyword: "required",
                      params: { missingProperty: d },
                      message: "must have required property '" + d + "'"
                    }
                  ], !1;
                {
                  const F = e;
                  for (const s in r)
                    if (!(s === "progress" || s === "step" || s === "pluginPath" || s === "pluginName"))
                      return o.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/0/additionalProperties",
                          keyword: "additionalProperties",
                          params: { additionalProperty: s },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (F === e) {
                    if (r.progress !== void 0) {
                      let s = r.progress;
                      const f = e;
                      if (e === f)
                        if (s && typeof s == "object" && !Array.isArray(s)) {
                          const A = e;
                          for (const a in s)
                            if (!(a === "weight" || a === "caption"))
                              return o.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/0/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: { additionalProperty: a },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (A === e) {
                            if (s.weight !== void 0) {
                              let a = s.weight;
                              const T = e;
                              if (!(typeof a == "number" && isFinite(a)))
                                return o.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/0/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: { type: "number" },
                                    message: "must be number"
                                  }
                                ], !1;
                              var u = T === e;
                            } else
                              var u = !0;
                            if (u)
                              if (s.caption !== void 0) {
                                const a = e;
                                if (typeof s.caption != "string")
                                  return o.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/0/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: { type: "string" },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var u = a === e;
                              } else
                                var u = !0;
                          }
                        } else
                          return o.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/0/properties/progress/type",
                              keyword: "type",
                              params: { type: "object" },
                              message: "must be object"
                            }
                          ], !1;
                      var h = f === e;
                    } else
                      var h = !0;
                    if (h) {
                      if (r.step !== void 0) {
                        let s = r.step;
                        const f = e;
                        if (typeof s != "string")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/0/properties/step/type",
                              keyword: "type",
                              params: { type: "string" },
                              message: "must be string"
                            }
                          ], !1;
                        if (s !== "activatePlugin")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/0/properties/step/const",
                              keyword: "const",
                              params: { allowedValue: "activatePlugin" },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var h = f === e;
                      } else
                        var h = !0;
                      if (h) {
                        if (r.pluginPath !== void 0) {
                          const s = e;
                          if (typeof r.pluginPath != "string")
                            return o.errors = [
                              {
                                instancePath: t + "/pluginPath",
                                schemaPath: "#/oneOf/0/properties/pluginPath/type",
                                keyword: "type",
                                params: { type: "string" },
                                message: "must be string"
                              }
                            ], !1;
                          var h = s === e;
                        } else
                          var h = !0;
                        if (h)
                          if (r.pluginName !== void 0) {
                            const s = e;
                            if (typeof r.pluginName != "string")
                              return o.errors = [
                                {
                                  instancePath: t + "/pluginName",
                                  schemaPath: "#/oneOf/0/properties/pluginName/type",
                                  keyword: "type",
                                  params: { type: "string" },
                                  message: "must be string"
                                }
                              ], !1;
                            var h = s === e;
                          } else
                            var h = !0;
                      }
                    }
                  }
                }
              } else
                return o.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/0/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (Y === "activateTheme") {
            if (e === e)
              if (r && typeof r == "object" && !Array.isArray(r)) {
                let d;
                if (r.step === void 0 && (d = "step") || r.themeFolderName === void 0 && (d = "themeFolderName"))
                  return o.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/1/required",
                      keyword: "required",
                      params: { missingProperty: d },
                      message: "must have required property '" + d + "'"
                    }
                  ], !1;
                {
                  const F = e;
                  for (const s in r)
                    if (!(s === "progress" || s === "step" || s === "themeFolderName"))
                      return o.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/1/additionalProperties",
                          keyword: "additionalProperties",
                          params: { additionalProperty: s },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (F === e) {
                    if (r.progress !== void 0) {
                      let s = r.progress;
                      const f = e;
                      if (e === f)
                        if (s && typeof s == "object" && !Array.isArray(s)) {
                          const A = e;
                          for (const a in s)
                            if (!(a === "weight" || a === "caption"))
                              return o.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/1/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: { additionalProperty: a },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (A === e) {
                            if (s.weight !== void 0) {
                              let a = s.weight;
                              const T = e;
                              if (!(typeof a == "number" && isFinite(a)))
                                return o.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/1/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: { type: "number" },
                                    message: "must be number"
                                  }
                                ], !1;
                              var b = T === e;
                            } else
                              var b = !0;
                            if (b)
                              if (s.caption !== void 0) {
                                const a = e;
                                if (typeof s.caption != "string")
                                  return o.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/1/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: { type: "string" },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var b = a === e;
                              } else
                                var b = !0;
                          }
                        } else
                          return o.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/1/properties/progress/type",
                              keyword: "type",
                              params: { type: "object" },
                              message: "must be object"
                            }
                          ], !1;
                      var k = f === e;
                    } else
                      var k = !0;
                    if (k) {
                      if (r.step !== void 0) {
                        let s = r.step;
                        const f = e;
                        if (typeof s != "string")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/1/properties/step/type",
                              keyword: "type",
                              params: { type: "string" },
                              message: "must be string"
                            }
                          ], !1;
                        if (s !== "activateTheme")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/1/properties/step/const",
                              keyword: "const",
                              params: { allowedValue: "activateTheme" },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var k = f === e;
                      } else
                        var k = !0;
                      if (k)
                        if (r.themeFolderName !== void 0) {
                          const s = e;
                          if (typeof r.themeFolderName != "string")
                            return o.errors = [
                              {
                                instancePath: t + "/themeFolderName",
                                schemaPath: "#/oneOf/1/properties/themeFolderName/type",
                                keyword: "type",
                                params: { type: "string" },
                                message: "must be string"
                              }
                            ], !1;
                          var k = s === e;
                        } else
                          var k = !0;
                    }
                  }
                }
              } else
                return o.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/1/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (Y === "cp") {
            if (e === e)
              if (r && typeof r == "object" && !Array.isArray(r)) {
                let d;
                if (r.fromPath === void 0 && (d = "fromPath") || r.step === void 0 && (d = "step") || r.toPath === void 0 && (d = "toPath"))
                  return o.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/2/required",
                      keyword: "required",
                      params: { missingProperty: d },
                      message: "must have required property '" + d + "'"
                    }
                  ], !1;
                {
                  const F = e;
                  for (const s in r)
                    if (!(s === "progress" || s === "step" || s === "fromPath" || s === "toPath"))
                      return o.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/2/additionalProperties",
                          keyword: "additionalProperties",
                          params: { additionalProperty: s },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (F === e) {
                    if (r.progress !== void 0) {
                      let s = r.progress;
                      const f = e;
                      if (e === f)
                        if (s && typeof s == "object" && !Array.isArray(s)) {
                          const A = e;
                          for (const a in s)
                            if (!(a === "weight" || a === "caption"))
                              return o.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/2/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: { additionalProperty: a },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (A === e) {
                            if (s.weight !== void 0) {
                              let a = s.weight;
                              const T = e;
                              if (!(typeof a == "number" && isFinite(a)))
                                return o.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/2/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: { type: "number" },
                                    message: "must be number"
                                  }
                                ], !1;
                              var y = T === e;
                            } else
                              var y = !0;
                            if (y)
                              if (s.caption !== void 0) {
                                const a = e;
                                if (typeof s.caption != "string")
                                  return o.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/2/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: { type: "string" },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var y = a === e;
                              } else
                                var y = !0;
                          }
                        } else
                          return o.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/2/properties/progress/type",
                              keyword: "type",
                              params: { type: "object" },
                              message: "must be object"
                            }
                          ], !1;
                      var E = f === e;
                    } else
                      var E = !0;
                    if (E) {
                      if (r.step !== void 0) {
                        let s = r.step;
                        const f = e;
                        if (typeof s != "string")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/2/properties/step/type",
                              keyword: "type",
                              params: { type: "string" },
                              message: "must be string"
                            }
                          ], !1;
                        if (s !== "cp")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/2/properties/step/const",
                              keyword: "const",
                              params: { allowedValue: "cp" },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var E = f === e;
                      } else
                        var E = !0;
                      if (E) {
                        if (r.fromPath !== void 0) {
                          const s = e;
                          if (typeof r.fromPath != "string")
                            return o.errors = [
                              {
                                instancePath: t + "/fromPath",
                                schemaPath: "#/oneOf/2/properties/fromPath/type",
                                keyword: "type",
                                params: { type: "string" },
                                message: "must be string"
                              }
                            ], !1;
                          var E = s === e;
                        } else
                          var E = !0;
                        if (E)
                          if (r.toPath !== void 0) {
                            const s = e;
                            if (typeof r.toPath != "string")
                              return o.errors = [
                                {
                                  instancePath: t + "/toPath",
                                  schemaPath: "#/oneOf/2/properties/toPath/type",
                                  keyword: "type",
                                  params: { type: "string" },
                                  message: "must be string"
                                }
                              ], !1;
                            var E = s === e;
                          } else
                            var E = !0;
                      }
                    }
                  }
                }
              } else
                return o.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/2/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (Y === "defineWpConfigConsts") {
            if (e === e)
              if (r && typeof r == "object" && !Array.isArray(r)) {
                let d;
                if (r.consts === void 0 && (d = "consts") || r.step === void 0 && (d = "step"))
                  return o.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/3/required",
                      keyword: "required",
                      params: { missingProperty: d },
                      message: "must have required property '" + d + "'"
                    }
                  ], !1;
                {
                  const F = e;
                  for (const s in r)
                    if (!(s === "progress" || s === "step" || s === "consts" || s === "method" || s === "virtualize"))
                      return o.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/3/additionalProperties",
                          keyword: "additionalProperties",
                          params: { additionalProperty: s },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (F === e) {
                    if (r.progress !== void 0) {
                      let s = r.progress;
                      const f = e;
                      if (e === f)
                        if (s && typeof s == "object" && !Array.isArray(s)) {
                          const A = e;
                          for (const a in s)
                            if (!(a === "weight" || a === "caption"))
                              return o.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/3/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: { additionalProperty: a },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (A === e) {
                            if (s.weight !== void 0) {
                              let a = s.weight;
                              const T = e;
                              if (!(typeof a == "number" && isFinite(a)))
                                return o.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/3/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: { type: "number" },
                                    message: "must be number"
                                  }
                                ], !1;
                              var S = T === e;
                            } else
                              var S = !0;
                            if (S)
                              if (s.caption !== void 0) {
                                const a = e;
                                if (typeof s.caption != "string")
                                  return o.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/3/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: { type: "string" },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var S = a === e;
                              } else
                                var S = !0;
                          }
                        } else
                          return o.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/3/properties/progress/type",
                              keyword: "type",
                              params: { type: "object" },
                              message: "must be object"
                            }
                          ], !1;
                      var I = f === e;
                    } else
                      var I = !0;
                    if (I) {
                      if (r.step !== void 0) {
                        let s = r.step;
                        const f = e;
                        if (typeof s != "string")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/3/properties/step/type",
                              keyword: "type",
                              params: { type: "string" },
                              message: "must be string"
                            }
                          ], !1;
                        if (s !== "defineWpConfigConsts")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/3/properties/step/const",
                              keyword: "const",
                              params: { allowedValue: "defineWpConfigConsts" },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var I = f === e;
                      } else
                        var I = !0;
                      if (I) {
                        if (r.consts !== void 0) {
                          let s = r.consts;
                          const f = e;
                          if (e === f && !(s && typeof s == "object" && !Array.isArray(s)))
                            return o.errors = [
                              {
                                instancePath: t + "/consts",
                                schemaPath: "#/oneOf/3/properties/consts/type",
                                keyword: "type",
                                params: { type: "object" },
                                message: "must be object"
                              }
                            ], !1;
                          var I = f === e;
                        } else
                          var I = !0;
                        if (I) {
                          if (r.method !== void 0) {
                            let s = r.method;
                            const f = e;
                            if (typeof s != "string")
                              return o.errors = [
                                {
                                  instancePath: t + "/method",
                                  schemaPath: "#/oneOf/3/properties/method/type",
                                  keyword: "type",
                                  params: { type: "string" },
                                  message: "must be string"
                                }
                              ], !1;
                            if (!(s === "rewrite-wp-config" || s === "define-before-run"))
                              return o.errors = [
                                {
                                  instancePath: t + "/method",
                                  schemaPath: "#/oneOf/3/properties/method/enum",
                                  keyword: "enum",
                                  params: {
                                    allowedValues: br.oneOf[3].properties.method.enum
                                  },
                                  message: "must be equal to one of the allowed values"
                                }
                              ], !1;
                            var I = f === e;
                          } else
                            var I = !0;
                          if (I)
                            if (r.virtualize !== void 0) {
                              const s = e;
                              if (typeof r.virtualize != "boolean")
                                return o.errors = [
                                  {
                                    instancePath: t + "/virtualize",
                                    schemaPath: "#/oneOf/3/properties/virtualize/type",
                                    keyword: "type",
                                    params: { type: "boolean" },
                                    message: "must be boolean"
                                  }
                                ], !1;
                              var I = s === e;
                            } else
                              var I = !0;
                        }
                      }
                    }
                  }
                }
              } else
                return o.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/3/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (Y === "defineSiteUrl") {
            if (e === e)
              if (r && typeof r == "object" && !Array.isArray(r)) {
                let d;
                if (r.siteUrl === void 0 && (d = "siteUrl") || r.step === void 0 && (d = "step"))
                  return o.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/4/required",
                      keyword: "required",
                      params: { missingProperty: d },
                      message: "must have required property '" + d + "'"
                    }
                  ], !1;
                {
                  const F = e;
                  for (const s in r)
                    if (!(s === "progress" || s === "step" || s === "siteUrl"))
                      return o.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/4/additionalProperties",
                          keyword: "additionalProperties",
                          params: { additionalProperty: s },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (F === e) {
                    if (r.progress !== void 0) {
                      let s = r.progress;
                      const f = e;
                      if (e === f)
                        if (s && typeof s == "object" && !Array.isArray(s)) {
                          const A = e;
                          for (const a in s)
                            if (!(a === "weight" || a === "caption"))
                              return o.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/4/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: { additionalProperty: a },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (A === e) {
                            if (s.weight !== void 0) {
                              let a = s.weight;
                              const T = e;
                              if (!(typeof a == "number" && isFinite(a)))
                                return o.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/4/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: { type: "number" },
                                    message: "must be number"
                                  }
                                ], !1;
                              var _ = T === e;
                            } else
                              var _ = !0;
                            if (_)
                              if (s.caption !== void 0) {
                                const a = e;
                                if (typeof s.caption != "string")
                                  return o.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/4/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: { type: "string" },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var _ = a === e;
                              } else
                                var _ = !0;
                          }
                        } else
                          return o.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/4/properties/progress/type",
                              keyword: "type",
                              params: { type: "object" },
                              message: "must be object"
                            }
                          ], !1;
                      var W = f === e;
                    } else
                      var W = !0;
                    if (W) {
                      if (r.step !== void 0) {
                        let s = r.step;
                        const f = e;
                        if (typeof s != "string")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/4/properties/step/type",
                              keyword: "type",
                              params: { type: "string" },
                              message: "must be string"
                            }
                          ], !1;
                        if (s !== "defineSiteUrl")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/4/properties/step/const",
                              keyword: "const",
                              params: { allowedValue: "defineSiteUrl" },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var W = f === e;
                      } else
                        var W = !0;
                      if (W)
                        if (r.siteUrl !== void 0) {
                          const s = e;
                          if (typeof r.siteUrl != "string")
                            return o.errors = [
                              {
                                instancePath: t + "/siteUrl",
                                schemaPath: "#/oneOf/4/properties/siteUrl/type",
                                keyword: "type",
                                params: { type: "string" },
                                message: "must be string"
                              }
                            ], !1;
                          var W = s === e;
                        } else
                          var W = !0;
                    }
                  }
                }
              } else
                return o.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/4/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (Y === "enableMultisite") {
            if (e === e)
              if (r && typeof r == "object" && !Array.isArray(r)) {
                let d;
                if (r.step === void 0 && (d = "step"))
                  return o.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/5/required",
                      keyword: "required",
                      params: { missingProperty: d },
                      message: "must have required property '" + d + "'"
                    }
                  ], !1;
                {
                  const F = e;
                  for (const s in r)
                    if (!(s === "progress" || s === "step"))
                      return o.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/5/additionalProperties",
                          keyword: "additionalProperties",
                          params: { additionalProperty: s },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (F === e) {
                    if (r.progress !== void 0) {
                      let s = r.progress;
                      const f = e;
                      if (e === f)
                        if (s && typeof s == "object" && !Array.isArray(s)) {
                          const A = e;
                          for (const a in s)
                            if (!(a === "weight" || a === "caption"))
                              return o.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/5/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: { additionalProperty: a },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (A === e) {
                            if (s.weight !== void 0) {
                              let a = s.weight;
                              const T = e;
                              if (!(typeof a == "number" && isFinite(a)))
                                return o.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/5/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: { type: "number" },
                                    message: "must be number"
                                  }
                                ], !1;
                              var X = T === e;
                            } else
                              var X = !0;
                            if (X)
                              if (s.caption !== void 0) {
                                const a = e;
                                if (typeof s.caption != "string")
                                  return o.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/5/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: { type: "string" },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var X = a === e;
                              } else
                                var X = !0;
                          }
                        } else
                          return o.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/5/properties/progress/type",
                              keyword: "type",
                              params: { type: "object" },
                              message: "must be object"
                            }
                          ], !1;
                      var x = f === e;
                    } else
                      var x = !0;
                    if (x)
                      if (r.step !== void 0) {
                        let s = r.step;
                        const f = e;
                        if (typeof s != "string")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/5/properties/step/type",
                              keyword: "type",
                              params: { type: "string" },
                              message: "must be string"
                            }
                          ], !1;
                        if (s !== "enableMultisite")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/5/properties/step/const",
                              keyword: "const",
                              params: { allowedValue: "enableMultisite" },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var x = f === e;
                      } else
                        var x = !0;
                  }
                }
              } else
                return o.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/5/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (Y === "importWxr") {
            if (e === e)
              if (r && typeof r == "object" && !Array.isArray(r)) {
                let d;
                if (r.file === void 0 && (d = "file") || r.step === void 0 && (d = "step"))
                  return o.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/6/required",
                      keyword: "required",
                      params: { missingProperty: d },
                      message: "must have required property '" + d + "'"
                    }
                  ], !1;
                {
                  const F = e;
                  for (const s in r)
                    if (!(s === "progress" || s === "step" || s === "file"))
                      return o.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/6/additionalProperties",
                          keyword: "additionalProperties",
                          params: { additionalProperty: s },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (F === e) {
                    if (r.progress !== void 0) {
                      let s = r.progress;
                      const f = e;
                      if (e === f)
                        if (s && typeof s == "object" && !Array.isArray(s)) {
                          const A = e;
                          for (const a in s)
                            if (!(a === "weight" || a === "caption"))
                              return o.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/6/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: { additionalProperty: a },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (A === e) {
                            if (s.weight !== void 0) {
                              let a = s.weight;
                              const T = e;
                              if (!(typeof a == "number" && isFinite(a)))
                                return o.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/6/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: { type: "number" },
                                    message: "must be number"
                                  }
                                ], !1;
                              var P = T === e;
                            } else
                              var P = !0;
                            if (P)
                              if (s.caption !== void 0) {
                                const a = e;
                                if (typeof s.caption != "string")
                                  return o.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/6/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: { type: "string" },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var P = a === e;
                              } else
                                var P = !0;
                          }
                        } else
                          return o.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/6/properties/progress/type",
                              keyword: "type",
                              params: { type: "object" },
                              message: "must be object"
                            }
                          ], !1;
                      var D = f === e;
                    } else
                      var D = !0;
                    if (D) {
                      if (r.step !== void 0) {
                        let s = r.step;
                        const f = e;
                        if (typeof s != "string")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/6/properties/step/type",
                              keyword: "type",
                              params: { type: "string" },
                              message: "must be string"
                            }
                          ], !1;
                        if (s !== "importWxr")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/6/properties/step/const",
                              keyword: "const",
                              params: { allowedValue: "importWxr" },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var D = f === e;
                      } else
                        var D = !0;
                      if (D)
                        if (r.file !== void 0) {
                          const s = e;
                          ee(r.file, {
                            instancePath: t + "/file",
                            parentData: r,
                            parentDataProperty: "file",
                            rootData: l
                          }) || (i = i === null ? ee.errors : i.concat(ee.errors), e = i.length);
                          var D = s === e;
                        } else
                          var D = !0;
                    }
                  }
                }
              } else
                return o.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/6/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (Y === "importThemeStarterContent") {
            if (e === e)
              if (r && typeof r == "object" && !Array.isArray(r)) {
                let d;
                if (r.step === void 0 && (d = "step"))
                  return o.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/7/required",
                      keyword: "required",
                      params: { missingProperty: d },
                      message: "must have required property '" + d + "'"
                    }
                  ], !1;
                {
                  const F = e;
                  for (const s in r)
                    if (!(s === "progress" || s === "step" || s === "themeSlug"))
                      return o.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/7/additionalProperties",
                          keyword: "additionalProperties",
                          params: { additionalProperty: s },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (F === e) {
                    if (r.progress !== void 0) {
                      let s = r.progress;
                      const f = e;
                      if (e === f)
                        if (s && typeof s == "object" && !Array.isArray(s)) {
                          const A = e;
                          for (const a in s)
                            if (!(a === "weight" || a === "caption"))
                              return o.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/7/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: { additionalProperty: a },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (A === e) {
                            if (s.weight !== void 0) {
                              let a = s.weight;
                              const T = e;
                              if (!(typeof a == "number" && isFinite(a)))
                                return o.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/7/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: { type: "number" },
                                    message: "must be number"
                                  }
                                ], !1;
                              var J = T === e;
                            } else
                              var J = !0;
                            if (J)
                              if (s.caption !== void 0) {
                                const a = e;
                                if (typeof s.caption != "string")
                                  return o.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/7/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: { type: "string" },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var J = a === e;
                              } else
                                var J = !0;
                          }
                        } else
                          return o.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/7/properties/progress/type",
                              keyword: "type",
                              params: { type: "object" },
                              message: "must be object"
                            }
                          ], !1;
                      var m = f === e;
                    } else
                      var m = !0;
                    if (m) {
                      if (r.step !== void 0) {
                        let s = r.step;
                        const f = e;
                        if (typeof s != "string")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/7/properties/step/type",
                              keyword: "type",
                              params: { type: "string" },
                              message: "must be string"
                            }
                          ], !1;
                        if (s !== "importThemeStarterContent")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/7/properties/step/const",
                              keyword: "const",
                              params: {
                                allowedValue: "importThemeStarterContent"
                              },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var m = f === e;
                      } else
                        var m = !0;
                      if (m)
                        if (r.themeSlug !== void 0) {
                          const s = e;
                          if (typeof r.themeSlug != "string")
                            return o.errors = [
                              {
                                instancePath: t + "/themeSlug",
                                schemaPath: "#/oneOf/7/properties/themeSlug/type",
                                keyword: "type",
                                params: { type: "string" },
                                message: "must be string"
                              }
                            ], !1;
                          var m = s === e;
                        } else
                          var m = !0;
                    }
                  }
                }
              } else
                return o.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/7/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (Y === "importWordPressFiles") {
            if (e === e)
              if (r && typeof r == "object" && !Array.isArray(r)) {
                let d;
                if (r.step === void 0 && (d = "step") || r.wordPressFilesZip === void 0 && (d = "wordPressFilesZip"))
                  return o.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/8/required",
                      keyword: "required",
                      params: { missingProperty: d },
                      message: "must have required property '" + d + "'"
                    }
                  ], !1;
                {
                  const F = e;
                  for (const s in r)
                    if (!(s === "progress" || s === "step" || s === "wordPressFilesZip" || s === "pathInZip"))
                      return o.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/8/additionalProperties",
                          keyword: "additionalProperties",
                          params: { additionalProperty: s },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (F === e) {
                    if (r.progress !== void 0) {
                      let s = r.progress;
                      const f = e;
                      if (e === f)
                        if (s && typeof s == "object" && !Array.isArray(s)) {
                          const A = e;
                          for (const a in s)
                            if (!(a === "weight" || a === "caption"))
                              return o.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/8/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: { additionalProperty: a },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (A === e) {
                            if (s.weight !== void 0) {
                              let a = s.weight;
                              const T = e;
                              if (!(typeof a == "number" && isFinite(a)))
                                return o.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/8/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: { type: "number" },
                                    message: "must be number"
                                  }
                                ], !1;
                              var R = T === e;
                            } else
                              var R = !0;
                            if (R)
                              if (s.caption !== void 0) {
                                const a = e;
                                if (typeof s.caption != "string")
                                  return o.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/8/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: { type: "string" },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var R = a === e;
                              } else
                                var R = !0;
                          }
                        } else
                          return o.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/8/properties/progress/type",
                              keyword: "type",
                              params: { type: "object" },
                              message: "must be object"
                            }
                          ], !1;
                      var V = f === e;
                    } else
                      var V = !0;
                    if (V) {
                      if (r.step !== void 0) {
                        let s = r.step;
                        const f = e;
                        if (typeof s != "string")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/8/properties/step/type",
                              keyword: "type",
                              params: { type: "string" },
                              message: "must be string"
                            }
                          ], !1;
                        if (s !== "importWordPressFiles")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/8/properties/step/const",
                              keyword: "const",
                              params: { allowedValue: "importWordPressFiles" },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var V = f === e;
                      } else
                        var V = !0;
                      if (V) {
                        if (r.wordPressFilesZip !== void 0) {
                          const s = e;
                          ee(r.wordPressFilesZip, {
                            instancePath: t + "/wordPressFilesZip",
                            parentData: r,
                            parentDataProperty: "wordPressFilesZip",
                            rootData: l
                          }) || (i = i === null ? ee.errors : i.concat(ee.errors), e = i.length);
                          var V = s === e;
                        } else
                          var V = !0;
                        if (V)
                          if (r.pathInZip !== void 0) {
                            const s = e;
                            if (typeof r.pathInZip != "string")
                              return o.errors = [
                                {
                                  instancePath: t + "/pathInZip",
                                  schemaPath: "#/oneOf/8/properties/pathInZip/type",
                                  keyword: "type",
                                  params: { type: "string" },
                                  message: "must be string"
                                }
                              ], !1;
                            var V = s === e;
                          } else
                            var V = !0;
                      }
                    }
                  }
                }
              } else
                return o.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/8/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (Y === "installPlugin") {
            if (e === e)
              if (r && typeof r == "object" && !Array.isArray(r)) {
                let d;
                if (r.pluginZipFile === void 0 && (d = "pluginZipFile") || r.step === void 0 && (d = "step"))
                  return o.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/9/required",
                      keyword: "required",
                      params: { missingProperty: d },
                      message: "must have required property '" + d + "'"
                    }
                  ], !1;
                {
                  const F = e;
                  for (const s in r)
                    if (!(s === "progress" || s === "ifAlreadyInstalled" || s === "step" || s === "pluginZipFile" || s === "options"))
                      return o.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/9/additionalProperties",
                          keyword: "additionalProperties",
                          params: { additionalProperty: s },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (F === e) {
                    if (r.progress !== void 0) {
                      let s = r.progress;
                      const f = e;
                      if (e === f)
                        if (s && typeof s == "object" && !Array.isArray(s)) {
                          const A = e;
                          for (const a in s)
                            if (!(a === "weight" || a === "caption"))
                              return o.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/9/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: { additionalProperty: a },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (A === e) {
                            if (s.weight !== void 0) {
                              let a = s.weight;
                              const T = e;
                              if (!(typeof a == "number" && isFinite(a)))
                                return o.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/9/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: { type: "number" },
                                    message: "must be number"
                                  }
                                ], !1;
                              var g = T === e;
                            } else
                              var g = !0;
                            if (g)
                              if (s.caption !== void 0) {
                                const a = e;
                                if (typeof s.caption != "string")
                                  return o.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/9/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: { type: "string" },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var g = a === e;
                              } else
                                var g = !0;
                          }
                        } else
                          return o.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/9/properties/progress/type",
                              keyword: "type",
                              params: { type: "object" },
                              message: "must be object"
                            }
                          ], !1;
                      var O = f === e;
                    } else
                      var O = !0;
                    if (O) {
                      if (r.ifAlreadyInstalled !== void 0) {
                        let s = r.ifAlreadyInstalled;
                        const f = e;
                        if (typeof s != "string")
                          return o.errors = [
                            {
                              instancePath: t + "/ifAlreadyInstalled",
                              schemaPath: "#/oneOf/9/properties/ifAlreadyInstalled/type",
                              keyword: "type",
                              params: { type: "string" },
                              message: "must be string"
                            }
                          ], !1;
                        if (!(s === "overwrite" || s === "skip" || s === "error"))
                          return o.errors = [
                            {
                              instancePath: t + "/ifAlreadyInstalled",
                              schemaPath: "#/oneOf/9/properties/ifAlreadyInstalled/enum",
                              keyword: "enum",
                              params: {
                                allowedValues: br.oneOf[9].properties.ifAlreadyInstalled.enum
                              },
                              message: "must be equal to one of the allowed values"
                            }
                          ], !1;
                        var O = f === e;
                      } else
                        var O = !0;
                      if (O) {
                        if (r.step !== void 0) {
                          let s = r.step;
                          const f = e;
                          if (typeof s != "string")
                            return o.errors = [
                              {
                                instancePath: t + "/step",
                                schemaPath: "#/oneOf/9/properties/step/type",
                                keyword: "type",
                                params: { type: "string" },
                                message: "must be string"
                              }
                            ], !1;
                          if (s !== "installPlugin")
                            return o.errors = [
                              {
                                instancePath: t + "/step",
                                schemaPath: "#/oneOf/9/properties/step/const",
                                keyword: "const",
                                params: { allowedValue: "installPlugin" },
                                message: "must be equal to constant"
                              }
                            ], !1;
                          var O = f === e;
                        } else
                          var O = !0;
                        if (O) {
                          if (r.pluginZipFile !== void 0) {
                            const s = e;
                            ee(r.pluginZipFile, {
                              instancePath: t + "/pluginZipFile",
                              parentData: r,
                              parentDataProperty: "pluginZipFile",
                              rootData: l
                            }) || (i = i === null ? ee.errors : i.concat(ee.errors), e = i.length);
                            var O = s === e;
                          } else
                            var O = !0;
                          if (O)
                            if (r.options !== void 0) {
                              let s = r.options;
                              const f = e;
                              if (e === e)
                                if (s && typeof s == "object" && !Array.isArray(s)) {
                                  const T = e;
                                  for (const ve in s)
                                    if (ve !== "activate")
                                      return o.errors = [
                                        {
                                          instancePath: t + "/options",
                                          schemaPath: "#/definitions/InstallPluginOptions/additionalProperties",
                                          keyword: "additionalProperties",
                                          params: { additionalProperty: ve },
                                          message: "must NOT have additional properties"
                                        }
                                      ], !1;
                                  if (T === e && s.activate !== void 0 && typeof s.activate != "boolean")
                                    return o.errors = [
                                      {
                                        instancePath: t + "/options/activate",
                                        schemaPath: "#/definitions/InstallPluginOptions/properties/activate/type",
                                        keyword: "type",
                                        params: { type: "boolean" },
                                        message: "must be boolean"
                                      }
                                    ], !1;
                                } else
                                  return o.errors = [
                                    {
                                      instancePath: t + "/options",
                                      schemaPath: "#/definitions/InstallPluginOptions/type",
                                      keyword: "type",
                                      params: { type: "object" },
                                      message: "must be object"
                                    }
                                  ], !1;
                              var O = f === e;
                            } else
                              var O = !0;
                        }
                      }
                    }
                  }
                }
              } else
                return o.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/9/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (Y === "installTheme") {
            if (e === e)
              if (r && typeof r == "object" && !Array.isArray(r)) {
                let d;
                if (r.step === void 0 && (d = "step") || r.themeZipFile === void 0 && (d = "themeZipFile"))
                  return o.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/10/required",
                      keyword: "required",
                      params: { missingProperty: d },
                      message: "must have required property '" + d + "'"
                    }
                  ], !1;
                {
                  const F = e;
                  for (const s in r)
                    if (!(s === "progress" || s === "ifAlreadyInstalled" || s === "step" || s === "themeZipFile" || s === "options"))
                      return o.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/10/additionalProperties",
                          keyword: "additionalProperties",
                          params: { additionalProperty: s },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (F === e) {
                    if (r.progress !== void 0) {
                      let s = r.progress;
                      const f = e;
                      if (e === f)
                        if (s && typeof s == "object" && !Array.isArray(s)) {
                          const A = e;
                          for (const a in s)
                            if (!(a === "weight" || a === "caption"))
                              return o.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/10/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: { additionalProperty: a },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (A === e) {
                            if (s.weight !== void 0) {
                              let a = s.weight;
                              const T = e;
                              if (!(typeof a == "number" && isFinite(a)))
                                return o.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/10/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: { type: "number" },
                                    message: "must be number"
                                  }
                                ], !1;
                              var w = T === e;
                            } else
                              var w = !0;
                            if (w)
                              if (s.caption !== void 0) {
                                const a = e;
                                if (typeof s.caption != "string")
                                  return o.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/10/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: { type: "string" },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var w = a === e;
                              } else
                                var w = !0;
                          }
                        } else
                          return o.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/10/properties/progress/type",
                              keyword: "type",
                              params: { type: "object" },
                              message: "must be object"
                            }
                          ], !1;
                      var $ = f === e;
                    } else
                      var $ = !0;
                    if ($) {
                      if (r.ifAlreadyInstalled !== void 0) {
                        let s = r.ifAlreadyInstalled;
                        const f = e;
                        if (typeof s != "string")
                          return o.errors = [
                            {
                              instancePath: t + "/ifAlreadyInstalled",
                              schemaPath: "#/oneOf/10/properties/ifAlreadyInstalled/type",
                              keyword: "type",
                              params: { type: "string" },
                              message: "must be string"
                            }
                          ], !1;
                        if (!(s === "overwrite" || s === "skip" || s === "error"))
                          return o.errors = [
                            {
                              instancePath: t + "/ifAlreadyInstalled",
                              schemaPath: "#/oneOf/10/properties/ifAlreadyInstalled/enum",
                              keyword: "enum",
                              params: {
                                allowedValues: br.oneOf[10].properties.ifAlreadyInstalled.enum
                              },
                              message: "must be equal to one of the allowed values"
                            }
                          ], !1;
                        var $ = f === e;
                      } else
                        var $ = !0;
                      if ($) {
                        if (r.step !== void 0) {
                          let s = r.step;
                          const f = e;
                          if (typeof s != "string")
                            return o.errors = [
                              {
                                instancePath: t + "/step",
                                schemaPath: "#/oneOf/10/properties/step/type",
                                keyword: "type",
                                params: { type: "string" },
                                message: "must be string"
                              }
                            ], !1;
                          if (s !== "installTheme")
                            return o.errors = [
                              {
                                instancePath: t + "/step",
                                schemaPath: "#/oneOf/10/properties/step/const",
                                keyword: "const",
                                params: { allowedValue: "installTheme" },
                                message: "must be equal to constant"
                              }
                            ], !1;
                          var $ = f === e;
                        } else
                          var $ = !0;
                        if ($) {
                          if (r.themeZipFile !== void 0) {
                            const s = e;
                            ee(r.themeZipFile, {
                              instancePath: t + "/themeZipFile",
                              parentData: r,
                              parentDataProperty: "themeZipFile",
                              rootData: l
                            }) || (i = i === null ? ee.errors : i.concat(ee.errors), e = i.length);
                            var $ = s === e;
                          } else
                            var $ = !0;
                          if ($)
                            if (r.options !== void 0) {
                              let s = r.options;
                              const f = e;
                              if (e === f)
                                if (s && typeof s == "object" && !Array.isArray(s)) {
                                  const a = e;
                                  for (const T in s)
                                    if (!(T === "activate" || T === "importStarterContent"))
                                      return o.errors = [
                                        {
                                          instancePath: t + "/options",
                                          schemaPath: "#/oneOf/10/properties/options/additionalProperties",
                                          keyword: "additionalProperties",
                                          params: { additionalProperty: T },
                                          message: "must NOT have additional properties"
                                        }
                                      ], !1;
                                  if (a === e) {
                                    if (s.activate !== void 0) {
                                      const T = e;
                                      if (typeof s.activate != "boolean")
                                        return o.errors = [
                                          {
                                            instancePath: t + "/options/activate",
                                            schemaPath: "#/oneOf/10/properties/options/properties/activate/type",
                                            keyword: "type",
                                            params: { type: "boolean" },
                                            message: "must be boolean"
                                          }
                                        ], !1;
                                      var v = T === e;
                                    } else
                                      var v = !0;
                                    if (v)
                                      if (s.importStarterContent !== void 0) {
                                        const T = e;
                                        if (typeof s.importStarterContent != "boolean")
                                          return o.errors = [
                                            {
                                              instancePath: t + "/options/importStarterContent",
                                              schemaPath: "#/oneOf/10/properties/options/properties/importStarterContent/type",
                                              keyword: "type",
                                              params: { type: "boolean" },
                                              message: "must be boolean"
                                            }
                                          ], !1;
                                        var v = T === e;
                                      } else
                                        var v = !0;
                                  }
                                } else
                                  return o.errors = [
                                    {
                                      instancePath: t + "/options",
                                      schemaPath: "#/oneOf/10/properties/options/type",
                                      keyword: "type",
                                      params: { type: "object" },
                                      message: "must be object"
                                    }
                                  ], !1;
                              var $ = f === e;
                            } else
                              var $ = !0;
                        }
                      }
                    }
                  }
                }
              } else
                return o.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/10/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (Y === "login") {
            if (e === e)
              if (r && typeof r == "object" && !Array.isArray(r)) {
                let d;
                if (r.step === void 0 && (d = "step"))
                  return o.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/11/required",
                      keyword: "required",
                      params: { missingProperty: d },
                      message: "must have required property '" + d + "'"
                    }
                  ], !1;
                {
                  const F = e;
                  for (const s in r)
                    if (!(s === "progress" || s === "step" || s === "username" || s === "password"))
                      return o.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/11/additionalProperties",
                          keyword: "additionalProperties",
                          params: { additionalProperty: s },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (F === e) {
                    if (r.progress !== void 0) {
                      let s = r.progress;
                      const f = e;
                      if (e === f)
                        if (s && typeof s == "object" && !Array.isArray(s)) {
                          const A = e;
                          for (const a in s)
                            if (!(a === "weight" || a === "caption"))
                              return o.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/11/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: { additionalProperty: a },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (A === e) {
                            if (s.weight !== void 0) {
                              let a = s.weight;
                              const T = e;
                              if (!(typeof a == "number" && isFinite(a)))
                                return o.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/11/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: { type: "number" },
                                    message: "must be number"
                                  }
                                ], !1;
                              var c = T === e;
                            } else
                              var c = !0;
                            if (c)
                              if (s.caption !== void 0) {
                                const a = e;
                                if (typeof s.caption != "string")
                                  return o.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/11/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: { type: "string" },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var c = a === e;
                              } else
                                var c = !0;
                          }
                        } else
                          return o.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/11/properties/progress/type",
                              keyword: "type",
                              params: { type: "object" },
                              message: "must be object"
                            }
                          ], !1;
                      var N = f === e;
                    } else
                      var N = !0;
                    if (N) {
                      if (r.step !== void 0) {
                        let s = r.step;
                        const f = e;
                        if (typeof s != "string")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/11/properties/step/type",
                              keyword: "type",
                              params: { type: "string" },
                              message: "must be string"
                            }
                          ], !1;
                        if (s !== "login")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/11/properties/step/const",
                              keyword: "const",
                              params: { allowedValue: "login" },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var N = f === e;
                      } else
                        var N = !0;
                      if (N) {
                        if (r.username !== void 0) {
                          const s = e;
                          if (typeof r.username != "string")
                            return o.errors = [
                              {
                                instancePath: t + "/username",
                                schemaPath: "#/oneOf/11/properties/username/type",
                                keyword: "type",
                                params: { type: "string" },
                                message: "must be string"
                              }
                            ], !1;
                          var N = s === e;
                        } else
                          var N = !0;
                        if (N)
                          if (r.password !== void 0) {
                            const s = e;
                            if (typeof r.password != "string")
                              return o.errors = [
                                {
                                  instancePath: t + "/password",
                                  schemaPath: "#/oneOf/11/properties/password/type",
                                  keyword: "type",
                                  params: { type: "string" },
                                  message: "must be string"
                                }
                              ], !1;
                            var N = s === e;
                          } else
                            var N = !0;
                      }
                    }
                  }
                }
              } else
                return o.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/11/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (Y === "mkdir") {
            if (e === e)
              if (r && typeof r == "object" && !Array.isArray(r)) {
                let d;
                if (r.path === void 0 && (d = "path") || r.step === void 0 && (d = "step"))
                  return o.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/12/required",
                      keyword: "required",
                      params: { missingProperty: d },
                      message: "must have required property '" + d + "'"
                    }
                  ], !1;
                {
                  const F = e;
                  for (const s in r)
                    if (!(s === "progress" || s === "step" || s === "path"))
                      return o.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/12/additionalProperties",
                          keyword: "additionalProperties",
                          params: { additionalProperty: s },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (F === e) {
                    if (r.progress !== void 0) {
                      let s = r.progress;
                      const f = e;
                      if (e === f)
                        if (s && typeof s == "object" && !Array.isArray(s)) {
                          const A = e;
                          for (const a in s)
                            if (!(a === "weight" || a === "caption"))
                              return o.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/12/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: { additionalProperty: a },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (A === e) {
                            if (s.weight !== void 0) {
                              let a = s.weight;
                              const T = e;
                              if (!(typeof a == "number" && isFinite(a)))
                                return o.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/12/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: { type: "number" },
                                    message: "must be number"
                                  }
                                ], !1;
                              var L = T === e;
                            } else
                              var L = !0;
                            if (L)
                              if (s.caption !== void 0) {
                                const a = e;
                                if (typeof s.caption != "string")
                                  return o.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/12/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: { type: "string" },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var L = a === e;
                              } else
                                var L = !0;
                          }
                        } else
                          return o.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/12/properties/progress/type",
                              keyword: "type",
                              params: { type: "object" },
                              message: "must be object"
                            }
                          ], !1;
                      var j = f === e;
                    } else
                      var j = !0;
                    if (j) {
                      if (r.step !== void 0) {
                        let s = r.step;
                        const f = e;
                        if (typeof s != "string")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/12/properties/step/type",
                              keyword: "type",
                              params: { type: "string" },
                              message: "must be string"
                            }
                          ], !1;
                        if (s !== "mkdir")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/12/properties/step/const",
                              keyword: "const",
                              params: { allowedValue: "mkdir" },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var j = f === e;
                      } else
                        var j = !0;
                      if (j)
                        if (r.path !== void 0) {
                          const s = e;
                          if (typeof r.path != "string")
                            return o.errors = [
                              {
                                instancePath: t + "/path",
                                schemaPath: "#/oneOf/12/properties/path/type",
                                keyword: "type",
                                params: { type: "string" },
                                message: "must be string"
                              }
                            ], !1;
                          var j = s === e;
                        } else
                          var j = !0;
                    }
                  }
                }
              } else
                return o.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/12/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (Y === "mv") {
            if (e === e)
              if (r && typeof r == "object" && !Array.isArray(r)) {
                let d;
                if (r.fromPath === void 0 && (d = "fromPath") || r.step === void 0 && (d = "step") || r.toPath === void 0 && (d = "toPath"))
                  return o.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/13/required",
                      keyword: "required",
                      params: { missingProperty: d },
                      message: "must have required property '" + d + "'"
                    }
                  ], !1;
                {
                  const F = e;
                  for (const s in r)
                    if (!(s === "progress" || s === "step" || s === "fromPath" || s === "toPath"))
                      return o.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/13/additionalProperties",
                          keyword: "additionalProperties",
                          params: { additionalProperty: s },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (F === e) {
                    if (r.progress !== void 0) {
                      let s = r.progress;
                      const f = e;
                      if (e === f)
                        if (s && typeof s == "object" && !Array.isArray(s)) {
                          const A = e;
                          for (const a in s)
                            if (!(a === "weight" || a === "caption"))
                              return o.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/13/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: { additionalProperty: a },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (A === e) {
                            if (s.weight !== void 0) {
                              let a = s.weight;
                              const T = e;
                              if (!(typeof a == "number" && isFinite(a)))
                                return o.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/13/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: { type: "number" },
                                    message: "must be number"
                                  }
                                ], !1;
                              var M = T === e;
                            } else
                              var M = !0;
                            if (M)
                              if (s.caption !== void 0) {
                                const a = e;
                                if (typeof s.caption != "string")
                                  return o.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/13/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: { type: "string" },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var M = a === e;
                              } else
                                var M = !0;
                          }
                        } else
                          return o.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/13/properties/progress/type",
                              keyword: "type",
                              params: { type: "object" },
                              message: "must be object"
                            }
                          ], !1;
                      var q = f === e;
                    } else
                      var q = !0;
                    if (q) {
                      if (r.step !== void 0) {
                        let s = r.step;
                        const f = e;
                        if (typeof s != "string")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/13/properties/step/type",
                              keyword: "type",
                              params: { type: "string" },
                              message: "must be string"
                            }
                          ], !1;
                        if (s !== "mv")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/13/properties/step/const",
                              keyword: "const",
                              params: { allowedValue: "mv" },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var q = f === e;
                      } else
                        var q = !0;
                      if (q) {
                        if (r.fromPath !== void 0) {
                          const s = e;
                          if (typeof r.fromPath != "string")
                            return o.errors = [
                              {
                                instancePath: t + "/fromPath",
                                schemaPath: "#/oneOf/13/properties/fromPath/type",
                                keyword: "type",
                                params: { type: "string" },
                                message: "must be string"
                              }
                            ], !1;
                          var q = s === e;
                        } else
                          var q = !0;
                        if (q)
                          if (r.toPath !== void 0) {
                            const s = e;
                            if (typeof r.toPath != "string")
                              return o.errors = [
                                {
                                  instancePath: t + "/toPath",
                                  schemaPath: "#/oneOf/13/properties/toPath/type",
                                  keyword: "type",
                                  params: { type: "string" },
                                  message: "must be string"
                                }
                              ], !1;
                            var q = s === e;
                          } else
                            var q = !0;
                      }
                    }
                  }
                }
              } else
                return o.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/13/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (Y === "resetData") {
            if (e === e)
              if (r && typeof r == "object" && !Array.isArray(r)) {
                let d;
                if (r.step === void 0 && (d = "step"))
                  return o.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/14/required",
                      keyword: "required",
                      params: { missingProperty: d },
                      message: "must have required property '" + d + "'"
                    }
                  ], !1;
                {
                  const F = e;
                  for (const s in r)
                    if (!(s === "progress" || s === "step"))
                      return o.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/14/additionalProperties",
                          keyword: "additionalProperties",
                          params: { additionalProperty: s },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (F === e) {
                    if (r.progress !== void 0) {
                      let s = r.progress;
                      const f = e;
                      if (e === f)
                        if (s && typeof s == "object" && !Array.isArray(s)) {
                          const A = e;
                          for (const a in s)
                            if (!(a === "weight" || a === "caption"))
                              return o.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/14/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: { additionalProperty: a },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (A === e) {
                            if (s.weight !== void 0) {
                              let a = s.weight;
                              const T = e;
                              if (!(typeof a == "number" && isFinite(a)))
                                return o.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/14/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: { type: "number" },
                                    message: "must be number"
                                  }
                                ], !1;
                              var H = T === e;
                            } else
                              var H = !0;
                            if (H)
                              if (s.caption !== void 0) {
                                const a = e;
                                if (typeof s.caption != "string")
                                  return o.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/14/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: { type: "string" },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var H = a === e;
                              } else
                                var H = !0;
                          }
                        } else
                          return o.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/14/properties/progress/type",
                              keyword: "type",
                              params: { type: "object" },
                              message: "must be object"
                            }
                          ], !1;
                      var te = f === e;
                    } else
                      var te = !0;
                    if (te)
                      if (r.step !== void 0) {
                        let s = r.step;
                        const f = e;
                        if (typeof s != "string")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/14/properties/step/type",
                              keyword: "type",
                              params: { type: "string" },
                              message: "must be string"
                            }
                          ], !1;
                        if (s !== "resetData")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/14/properties/step/const",
                              keyword: "const",
                              params: { allowedValue: "resetData" },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var te = f === e;
                      } else
                        var te = !0;
                  }
                }
              } else
                return o.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/14/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (Y === "request") {
            if (e === e)
              if (r && typeof r == "object" && !Array.isArray(r)) {
                let d;
                if (r.request === void 0 && (d = "request") || r.step === void 0 && (d = "step"))
                  return o.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/15/required",
                      keyword: "required",
                      params: { missingProperty: d },
                      message: "must have required property '" + d + "'"
                    }
                  ], !1;
                {
                  const F = e;
                  for (const s in r)
                    if (!(s === "progress" || s === "step" || s === "request"))
                      return o.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/15/additionalProperties",
                          keyword: "additionalProperties",
                          params: { additionalProperty: s },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (F === e) {
                    if (r.progress !== void 0) {
                      let s = r.progress;
                      const f = e;
                      if (e === f)
                        if (s && typeof s == "object" && !Array.isArray(s)) {
                          const A = e;
                          for (const a in s)
                            if (!(a === "weight" || a === "caption"))
                              return o.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/15/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: { additionalProperty: a },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (A === e) {
                            if (s.weight !== void 0) {
                              let a = s.weight;
                              const T = e;
                              if (!(typeof a == "number" && isFinite(a)))
                                return o.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/15/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: { type: "number" },
                                    message: "must be number"
                                  }
                                ], !1;
                              var Z = T === e;
                            } else
                              var Z = !0;
                            if (Z)
                              if (s.caption !== void 0) {
                                const a = e;
                                if (typeof s.caption != "string")
                                  return o.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/15/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: { type: "string" },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var Z = a === e;
                              } else
                                var Z = !0;
                          }
                        } else
                          return o.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/15/properties/progress/type",
                              keyword: "type",
                              params: { type: "object" },
                              message: "must be object"
                            }
                          ], !1;
                      var C = f === e;
                    } else
                      var C = !0;
                    if (C) {
                      if (r.step !== void 0) {
                        let s = r.step;
                        const f = e;
                        if (typeof s != "string")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/15/properties/step/type",
                              keyword: "type",
                              params: { type: "string" },
                              message: "must be string"
                            }
                          ], !1;
                        if (s !== "request")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/15/properties/step/const",
                              keyword: "const",
                              params: { allowedValue: "request" },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var C = f === e;
                      } else
                        var C = !0;
                      if (C)
                        if (r.request !== void 0) {
                          const s = e;
                          ye(r.request, {
                            instancePath: t + "/request",
                            parentData: r,
                            parentDataProperty: "request",
                            rootData: l
                          }) || (i = i === null ? ye.errors : i.concat(ye.errors), e = i.length);
                          var C = s === e;
                        } else
                          var C = !0;
                    }
                  }
                }
              } else
                return o.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/15/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (Y === "rm") {
            if (e === e)
              if (r && typeof r == "object" && !Array.isArray(r)) {
                let d;
                if (r.path === void 0 && (d = "path") || r.step === void 0 && (d = "step"))
                  return o.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/16/required",
                      keyword: "required",
                      params: { missingProperty: d },
                      message: "must have required property '" + d + "'"
                    }
                  ], !1;
                {
                  const F = e;
                  for (const s in r)
                    if (!(s === "progress" || s === "step" || s === "path"))
                      return o.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/16/additionalProperties",
                          keyword: "additionalProperties",
                          params: { additionalProperty: s },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (F === e) {
                    if (r.progress !== void 0) {
                      let s = r.progress;
                      const f = e;
                      if (e === f)
                        if (s && typeof s == "object" && !Array.isArray(s)) {
                          const A = e;
                          for (const a in s)
                            if (!(a === "weight" || a === "caption"))
                              return o.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/16/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: { additionalProperty: a },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (A === e) {
                            if (s.weight !== void 0) {
                              let a = s.weight;
                              const T = e;
                              if (!(typeof a == "number" && isFinite(a)))
                                return o.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/16/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: { type: "number" },
                                    message: "must be number"
                                  }
                                ], !1;
                              var U = T === e;
                            } else
                              var U = !0;
                            if (U)
                              if (s.caption !== void 0) {
                                const a = e;
                                if (typeof s.caption != "string")
                                  return o.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/16/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: { type: "string" },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var U = a === e;
                              } else
                                var U = !0;
                          }
                        } else
                          return o.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/16/properties/progress/type",
                              keyword: "type",
                              params: { type: "object" },
                              message: "must be object"
                            }
                          ], !1;
                      var z = f === e;
                    } else
                      var z = !0;
                    if (z) {
                      if (r.step !== void 0) {
                        let s = r.step;
                        const f = e;
                        if (typeof s != "string")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/16/properties/step/type",
                              keyword: "type",
                              params: { type: "string" },
                              message: "must be string"
                            }
                          ], !1;
                        if (s !== "rm")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/16/properties/step/const",
                              keyword: "const",
                              params: { allowedValue: "rm" },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var z = f === e;
                      } else
                        var z = !0;
                      if (z)
                        if (r.path !== void 0) {
                          const s = e;
                          if (typeof r.path != "string")
                            return o.errors = [
                              {
                                instancePath: t + "/path",
                                schemaPath: "#/oneOf/16/properties/path/type",
                                keyword: "type",
                                params: { type: "string" },
                                message: "must be string"
                              }
                            ], !1;
                          var z = s === e;
                        } else
                          var z = !0;
                    }
                  }
                }
              } else
                return o.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/16/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (Y === "rmdir") {
            if (e === e)
              if (r && typeof r == "object" && !Array.isArray(r)) {
                let d;
                if (r.path === void 0 && (d = "path") || r.step === void 0 && (d = "step"))
                  return o.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/17/required",
                      keyword: "required",
                      params: { missingProperty: d },
                      message: "must have required property '" + d + "'"
                    }
                  ], !1;
                {
                  const F = e;
                  for (const s in r)
                    if (!(s === "progress" || s === "step" || s === "path"))
                      return o.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/17/additionalProperties",
                          keyword: "additionalProperties",
                          params: { additionalProperty: s },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (F === e) {
                    if (r.progress !== void 0) {
                      let s = r.progress;
                      const f = e;
                      if (e === f)
                        if (s && typeof s == "object" && !Array.isArray(s)) {
                          const A = e;
                          for (const a in s)
                            if (!(a === "weight" || a === "caption"))
                              return o.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/17/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: { additionalProperty: a },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (A === e) {
                            if (s.weight !== void 0) {
                              let a = s.weight;
                              const T = e;
                              if (!(typeof a == "number" && isFinite(a)))
                                return o.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/17/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: { type: "number" },
                                    message: "must be number"
                                  }
                                ], !1;
                              var G = T === e;
                            } else
                              var G = !0;
                            if (G)
                              if (s.caption !== void 0) {
                                const a = e;
                                if (typeof s.caption != "string")
                                  return o.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/17/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: { type: "string" },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var G = a === e;
                              } else
                                var G = !0;
                          }
                        } else
                          return o.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/17/properties/progress/type",
                              keyword: "type",
                              params: { type: "object" },
                              message: "must be object"
                            }
                          ], !1;
                      var re = f === e;
                    } else
                      var re = !0;
                    if (re) {
                      if (r.step !== void 0) {
                        let s = r.step;
                        const f = e;
                        if (typeof s != "string")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/17/properties/step/type",
                              keyword: "type",
                              params: { type: "string" },
                              message: "must be string"
                            }
                          ], !1;
                        if (s !== "rmdir")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/17/properties/step/const",
                              keyword: "const",
                              params: { allowedValue: "rmdir" },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var re = f === e;
                      } else
                        var re = !0;
                      if (re)
                        if (r.path !== void 0) {
                          const s = e;
                          if (typeof r.path != "string")
                            return o.errors = [
                              {
                                instancePath: t + "/path",
                                schemaPath: "#/oneOf/17/properties/path/type",
                                keyword: "type",
                                params: { type: "string" },
                                message: "must be string"
                              }
                            ], !1;
                          var re = s === e;
                        } else
                          var re = !0;
                    }
                  }
                }
              } else
                return o.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/17/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (Y === "runPHP") {
            if (e === e)
              if (r && typeof r == "object" && !Array.isArray(r)) {
                let d;
                if (r.code === void 0 && (d = "code") || r.step === void 0 && (d = "step"))
                  return o.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/18/required",
                      keyword: "required",
                      params: { missingProperty: d },
                      message: "must have required property '" + d + "'"
                    }
                  ], !1;
                {
                  const F = e;
                  for (const s in r)
                    if (!(s === "progress" || s === "step" || s === "code"))
                      return o.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/18/additionalProperties",
                          keyword: "additionalProperties",
                          params: { additionalProperty: s },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (F === e) {
                    if (r.progress !== void 0) {
                      let s = r.progress;
                      const f = e;
                      if (e === f)
                        if (s && typeof s == "object" && !Array.isArray(s)) {
                          const A = e;
                          for (const a in s)
                            if (!(a === "weight" || a === "caption"))
                              return o.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/18/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: { additionalProperty: a },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (A === e) {
                            if (s.weight !== void 0) {
                              let a = s.weight;
                              const T = e;
                              if (!(typeof a == "number" && isFinite(a)))
                                return o.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/18/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: { type: "number" },
                                    message: "must be number"
                                  }
                                ], !1;
                              var pe = T === e;
                            } else
                              var pe = !0;
                            if (pe)
                              if (s.caption !== void 0) {
                                const a = e;
                                if (typeof s.caption != "string")
                                  return o.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/18/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: { type: "string" },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var pe = a === e;
                              } else
                                var pe = !0;
                          }
                        } else
                          return o.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/18/properties/progress/type",
                              keyword: "type",
                              params: { type: "object" },
                              message: "must be object"
                            }
                          ], !1;
                      var le = f === e;
                    } else
                      var le = !0;
                    if (le) {
                      if (r.step !== void 0) {
                        let s = r.step;
                        const f = e;
                        if (typeof s != "string")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/18/properties/step/type",
                              keyword: "type",
                              params: { type: "string" },
                              message: "must be string"
                            }
                          ], !1;
                        if (s !== "runPHP")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/18/properties/step/const",
                              keyword: "const",
                              params: { allowedValue: "runPHP" },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var le = f === e;
                      } else
                        var le = !0;
                      if (le)
                        if (r.code !== void 0) {
                          const s = e;
                          if (typeof r.code != "string")
                            return o.errors = [
                              {
                                instancePath: t + "/code",
                                schemaPath: "#/oneOf/18/properties/code/type",
                                keyword: "type",
                                params: { type: "string" },
                                message: "must be string"
                              }
                            ], !1;
                          var le = s === e;
                        } else
                          var le = !0;
                    }
                  }
                }
              } else
                return o.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/18/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (Y === "runPHPWithOptions") {
            if (e === e)
              if (r && typeof r == "object" && !Array.isArray(r)) {
                let d;
                if (r.options === void 0 && (d = "options") || r.step === void 0 && (d = "step"))
                  return o.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/19/required",
                      keyword: "required",
                      params: { missingProperty: d },
                      message: "must have required property '" + d + "'"
                    }
                  ], !1;
                {
                  const F = e;
                  for (const s in r)
                    if (!(s === "progress" || s === "step" || s === "options"))
                      return o.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/19/additionalProperties",
                          keyword: "additionalProperties",
                          params: { additionalProperty: s },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (F === e) {
                    if (r.progress !== void 0) {
                      let s = r.progress;
                      const f = e;
                      if (e === f)
                        if (s && typeof s == "object" && !Array.isArray(s)) {
                          const A = e;
                          for (const a in s)
                            if (!(a === "weight" || a === "caption"))
                              return o.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/19/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: { additionalProperty: a },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (A === e) {
                            if (s.weight !== void 0) {
                              let a = s.weight;
                              const T = e;
                              if (!(typeof a == "number" && isFinite(a)))
                                return o.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/19/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: { type: "number" },
                                    message: "must be number"
                                  }
                                ], !1;
                              var Ie = T === e;
                            } else
                              var Ie = !0;
                            if (Ie)
                              if (s.caption !== void 0) {
                                const a = e;
                                if (typeof s.caption != "string")
                                  return o.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/19/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: { type: "string" },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var Ie = a === e;
                              } else
                                var Ie = !0;
                          }
                        } else
                          return o.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/19/properties/progress/type",
                              keyword: "type",
                              params: { type: "object" },
                              message: "must be object"
                            }
                          ], !1;
                      var $e = f === e;
                    } else
                      var $e = !0;
                    if ($e) {
                      if (r.step !== void 0) {
                        let s = r.step;
                        const f = e;
                        if (typeof s != "string")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/19/properties/step/type",
                              keyword: "type",
                              params: { type: "string" },
                              message: "must be string"
                            }
                          ], !1;
                        if (s !== "runPHPWithOptions")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/19/properties/step/const",
                              keyword: "const",
                              params: { allowedValue: "runPHPWithOptions" },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var $e = f === e;
                      } else
                        var $e = !0;
                      if ($e)
                        if (r.options !== void 0) {
                          const s = e;
                          ne(r.options, {
                            instancePath: t + "/options",
                            parentData: r,
                            parentDataProperty: "options",
                            rootData: l
                          }) || (i = i === null ? ne.errors : i.concat(ne.errors), e = i.length);
                          var $e = s === e;
                        } else
                          var $e = !0;
                    }
                  }
                }
              } else
                return o.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/19/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (Y === "runWpInstallationWizard") {
            if (e === e)
              if (r && typeof r == "object" && !Array.isArray(r)) {
                let d;
                if (r.options === void 0 && (d = "options") || r.step === void 0 && (d = "step"))
                  return o.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/20/required",
                      keyword: "required",
                      params: { missingProperty: d },
                      message: "must have required property '" + d + "'"
                    }
                  ], !1;
                {
                  const F = e;
                  for (const s in r)
                    if (!(s === "progress" || s === "step" || s === "options"))
                      return o.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/20/additionalProperties",
                          keyword: "additionalProperties",
                          params: { additionalProperty: s },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (F === e) {
                    if (r.progress !== void 0) {
                      let s = r.progress;
                      const f = e;
                      if (e === f)
                        if (s && typeof s == "object" && !Array.isArray(s)) {
                          const A = e;
                          for (const a in s)
                            if (!(a === "weight" || a === "caption"))
                              return o.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/20/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: { additionalProperty: a },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (A === e) {
                            if (s.weight !== void 0) {
                              let a = s.weight;
                              const T = e;
                              if (!(typeof a == "number" && isFinite(a)))
                                return o.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/20/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: { type: "number" },
                                    message: "must be number"
                                  }
                                ], !1;
                              var De = T === e;
                            } else
                              var De = !0;
                            if (De)
                              if (s.caption !== void 0) {
                                const a = e;
                                if (typeof s.caption != "string")
                                  return o.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/20/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: { type: "string" },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var De = a === e;
                              } else
                                var De = !0;
                          }
                        } else
                          return o.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/20/properties/progress/type",
                              keyword: "type",
                              params: { type: "object" },
                              message: "must be object"
                            }
                          ], !1;
                      var Te = f === e;
                    } else
                      var Te = !0;
                    if (Te) {
                      if (r.step !== void 0) {
                        let s = r.step;
                        const f = e;
                        if (typeof s != "string")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/20/properties/step/type",
                              keyword: "type",
                              params: { type: "string" },
                              message: "must be string"
                            }
                          ], !1;
                        if (s !== "runWpInstallationWizard")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/20/properties/step/const",
                              keyword: "const",
                              params: {
                                allowedValue: "runWpInstallationWizard"
                              },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var Te = f === e;
                      } else
                        var Te = !0;
                      if (Te)
                        if (r.options !== void 0) {
                          let s = r.options;
                          const f = e;
                          if (e === e)
                            if (s && typeof s == "object" && !Array.isArray(s)) {
                              const T = e;
                              for (const ve in s)
                                if (!(ve === "adminUsername" || ve === "adminPassword"))
                                  return o.errors = [
                                    {
                                      instancePath: t + "/options",
                                      schemaPath: "#/definitions/WordPressInstallationOptions/additionalProperties",
                                      keyword: "additionalProperties",
                                      params: { additionalProperty: ve },
                                      message: "must NOT have additional properties"
                                    }
                                  ], !1;
                              if (T === e) {
                                if (s.adminUsername !== void 0) {
                                  const ve = e;
                                  if (typeof s.adminUsername != "string")
                                    return o.errors = [
                                      {
                                        instancePath: t + "/options/adminUsername",
                                        schemaPath: "#/definitions/WordPressInstallationOptions/properties/adminUsername/type",
                                        keyword: "type",
                                        params: { type: "string" },
                                        message: "must be string"
                                      }
                                    ], !1;
                                  var We = ve === e;
                                } else
                                  var We = !0;
                                if (We)
                                  if (s.adminPassword !== void 0) {
                                    const ve = e;
                                    if (typeof s.adminPassword != "string")
                                      return o.errors = [
                                        {
                                          instancePath: t + "/options/adminPassword",
                                          schemaPath: "#/definitions/WordPressInstallationOptions/properties/adminPassword/type",
                                          keyword: "type",
                                          params: { type: "string" },
                                          message: "must be string"
                                        }
                                      ], !1;
                                    var We = ve === e;
                                  } else
                                    var We = !0;
                              }
                            } else
                              return o.errors = [
                                {
                                  instancePath: t + "/options",
                                  schemaPath: "#/definitions/WordPressInstallationOptions/type",
                                  keyword: "type",
                                  params: { type: "object" },
                                  message: "must be object"
                                }
                              ], !1;
                          var Te = f === e;
                        } else
                          var Te = !0;
                    }
                  }
                }
              } else
                return o.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/20/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (Y === "runSql") {
            if (e === e)
              if (r && typeof r == "object" && !Array.isArray(r)) {
                let d;
                if (r.sql === void 0 && (d = "sql") || r.step === void 0 && (d = "step"))
                  return o.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/21/required",
                      keyword: "required",
                      params: { missingProperty: d },
                      message: "must have required property '" + d + "'"
                    }
                  ], !1;
                {
                  const F = e;
                  for (const s in r)
                    if (!(s === "progress" || s === "step" || s === "sql"))
                      return o.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/21/additionalProperties",
                          keyword: "additionalProperties",
                          params: { additionalProperty: s },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (F === e) {
                    if (r.progress !== void 0) {
                      let s = r.progress;
                      const f = e;
                      if (e === f)
                        if (s && typeof s == "object" && !Array.isArray(s)) {
                          const A = e;
                          for (const a in s)
                            if (!(a === "weight" || a === "caption"))
                              return o.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/21/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: { additionalProperty: a },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (A === e) {
                            if (s.weight !== void 0) {
                              let a = s.weight;
                              const T = e;
                              if (!(typeof a == "number" && isFinite(a)))
                                return o.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/21/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: { type: "number" },
                                    message: "must be number"
                                  }
                                ], !1;
                              var Me = T === e;
                            } else
                              var Me = !0;
                            if (Me)
                              if (s.caption !== void 0) {
                                const a = e;
                                if (typeof s.caption != "string")
                                  return o.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/21/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: { type: "string" },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var Me = a === e;
                              } else
                                var Me = !0;
                          }
                        } else
                          return o.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/21/properties/progress/type",
                              keyword: "type",
                              params: { type: "object" },
                              message: "must be object"
                            }
                          ], !1;
                      var je = f === e;
                    } else
                      var je = !0;
                    if (je) {
                      if (r.step !== void 0) {
                        let s = r.step;
                        const f = e;
                        if (typeof s != "string")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/21/properties/step/type",
                              keyword: "type",
                              params: { type: "string" },
                              message: "must be string"
                            }
                          ], !1;
                        if (s !== "runSql")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/21/properties/step/const",
                              keyword: "const",
                              params: { allowedValue: "runSql" },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var je = f === e;
                      } else
                        var je = !0;
                      if (je)
                        if (r.sql !== void 0) {
                          const s = e;
                          ee(r.sql, {
                            instancePath: t + "/sql",
                            parentData: r,
                            parentDataProperty: "sql",
                            rootData: l
                          }) || (i = i === null ? ee.errors : i.concat(ee.errors), e = i.length);
                          var je = s === e;
                        } else
                          var je = !0;
                    }
                  }
                }
              } else
                return o.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/21/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (Y === "setSiteOptions") {
            if (e === e)
              if (r && typeof r == "object" && !Array.isArray(r)) {
                let d;
                if (r.options === void 0 && (d = "options") || r.step === void 0 && (d = "step"))
                  return o.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/22/required",
                      keyword: "required",
                      params: { missingProperty: d },
                      message: "must have required property '" + d + "'"
                    }
                  ], !1;
                {
                  const F = e;
                  for (const s in r)
                    if (!(s === "progress" || s === "step" || s === "options"))
                      return o.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/22/additionalProperties",
                          keyword: "additionalProperties",
                          params: { additionalProperty: s },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (F === e) {
                    if (r.progress !== void 0) {
                      let s = r.progress;
                      const f = e;
                      if (e === f)
                        if (s && typeof s == "object" && !Array.isArray(s)) {
                          const A = e;
                          for (const a in s)
                            if (!(a === "weight" || a === "caption"))
                              return o.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/22/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: { additionalProperty: a },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (A === e) {
                            if (s.weight !== void 0) {
                              let a = s.weight;
                              const T = e;
                              if (!(typeof a == "number" && isFinite(a)))
                                return o.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/22/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: { type: "number" },
                                    message: "must be number"
                                  }
                                ], !1;
                              var Be = T === e;
                            } else
                              var Be = !0;
                            if (Be)
                              if (s.caption !== void 0) {
                                const a = e;
                                if (typeof s.caption != "string")
                                  return o.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/22/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: { type: "string" },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var Be = a === e;
                              } else
                                var Be = !0;
                          }
                        } else
                          return o.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/22/properties/progress/type",
                              keyword: "type",
                              params: { type: "object" },
                              message: "must be object"
                            }
                          ], !1;
                      var Ae = f === e;
                    } else
                      var Ae = !0;
                    if (Ae) {
                      if (r.step !== void 0) {
                        let s = r.step;
                        const f = e;
                        if (typeof s != "string")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/22/properties/step/type",
                              keyword: "type",
                              params: { type: "string" },
                              message: "must be string"
                            }
                          ], !1;
                        if (s !== "setSiteOptions")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/22/properties/step/const",
                              keyword: "const",
                              params: { allowedValue: "setSiteOptions" },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var Ae = f === e;
                      } else
                        var Ae = !0;
                      if (Ae)
                        if (r.options !== void 0) {
                          let s = r.options;
                          const f = e;
                          if (e === f && !(s && typeof s == "object" && !Array.isArray(s)))
                            return o.errors = [
                              {
                                instancePath: t + "/options",
                                schemaPath: "#/oneOf/22/properties/options/type",
                                keyword: "type",
                                params: { type: "object" },
                                message: "must be object"
                              }
                            ], !1;
                          var Ae = f === e;
                        } else
                          var Ae = !0;
                    }
                  }
                }
              } else
                return o.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/22/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (Y === "unzip") {
            if (e === e)
              if (r && typeof r == "object" && !Array.isArray(r)) {
                let d;
                if (r.extractToPath === void 0 && (d = "extractToPath") || r.step === void 0 && (d = "step"))
                  return o.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/23/required",
                      keyword: "required",
                      params: { missingProperty: d },
                      message: "must have required property '" + d + "'"
                    }
                  ], !1;
                {
                  const F = e;
                  for (const s in r)
                    if (!(s === "progress" || s === "step" || s === "zipFile" || s === "zipPath" || s === "extractToPath"))
                      return o.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/23/additionalProperties",
                          keyword: "additionalProperties",
                          params: { additionalProperty: s },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (F === e) {
                    if (r.progress !== void 0) {
                      let s = r.progress;
                      const f = e;
                      if (e === f)
                        if (s && typeof s == "object" && !Array.isArray(s)) {
                          const A = e;
                          for (const a in s)
                            if (!(a === "weight" || a === "caption"))
                              return o.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/23/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: { additionalProperty: a },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (A === e) {
                            if (s.weight !== void 0) {
                              let a = s.weight;
                              const T = e;
                              if (!(typeof a == "number" && isFinite(a)))
                                return o.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/23/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: { type: "number" },
                                    message: "must be number"
                                  }
                                ], !1;
                              var Ue = T === e;
                            } else
                              var Ue = !0;
                            if (Ue)
                              if (s.caption !== void 0) {
                                const a = e;
                                if (typeof s.caption != "string")
                                  return o.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/23/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: { type: "string" },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var Ue = a === e;
                              } else
                                var Ue = !0;
                          }
                        } else
                          return o.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/23/properties/progress/type",
                              keyword: "type",
                              params: { type: "object" },
                              message: "must be object"
                            }
                          ], !1;
                      var fe = f === e;
                    } else
                      var fe = !0;
                    if (fe) {
                      if (r.step !== void 0) {
                        let s = r.step;
                        const f = e;
                        if (typeof s != "string")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/23/properties/step/type",
                              keyword: "type",
                              params: { type: "string" },
                              message: "must be string"
                            }
                          ], !1;
                        if (s !== "unzip")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/23/properties/step/const",
                              keyword: "const",
                              params: { allowedValue: "unzip" },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var fe = f === e;
                      } else
                        var fe = !0;
                      if (fe) {
                        if (r.zipFile !== void 0) {
                          const s = e;
                          ee(r.zipFile, {
                            instancePath: t + "/zipFile",
                            parentData: r,
                            parentDataProperty: "zipFile",
                            rootData: l
                          }) || (i = i === null ? ee.errors : i.concat(ee.errors), e = i.length);
                          var fe = s === e;
                        } else
                          var fe = !0;
                        if (fe) {
                          if (r.zipPath !== void 0) {
                            const s = e;
                            if (typeof r.zipPath != "string")
                              return o.errors = [
                                {
                                  instancePath: t + "/zipPath",
                                  schemaPath: "#/oneOf/23/properties/zipPath/type",
                                  keyword: "type",
                                  params: { type: "string" },
                                  message: "must be string"
                                }
                              ], !1;
                            var fe = s === e;
                          } else
                            var fe = !0;
                          if (fe)
                            if (r.extractToPath !== void 0) {
                              const s = e;
                              if (typeof r.extractToPath != "string")
                                return o.errors = [
                                  {
                                    instancePath: t + "/extractToPath",
                                    schemaPath: "#/oneOf/23/properties/extractToPath/type",
                                    keyword: "type",
                                    params: { type: "string" },
                                    message: "must be string"
                                  }
                                ], !1;
                              var fe = s === e;
                            } else
                              var fe = !0;
                        }
                      }
                    }
                  }
                }
              } else
                return o.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/23/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (Y === "updateUserMeta") {
            if (e === e)
              if (r && typeof r == "object" && !Array.isArray(r)) {
                let d;
                if (r.meta === void 0 && (d = "meta") || r.step === void 0 && (d = "step") || r.userId === void 0 && (d = "userId"))
                  return o.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/24/required",
                      keyword: "required",
                      params: { missingProperty: d },
                      message: "must have required property '" + d + "'"
                    }
                  ], !1;
                {
                  const F = e;
                  for (const s in r)
                    if (!(s === "progress" || s === "step" || s === "meta" || s === "userId"))
                      return o.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/24/additionalProperties",
                          keyword: "additionalProperties",
                          params: { additionalProperty: s },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (F === e) {
                    if (r.progress !== void 0) {
                      let s = r.progress;
                      const f = e;
                      if (e === f)
                        if (s && typeof s == "object" && !Array.isArray(s)) {
                          const A = e;
                          for (const a in s)
                            if (!(a === "weight" || a === "caption"))
                              return o.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/24/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: { additionalProperty: a },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (A === e) {
                            if (s.weight !== void 0) {
                              let a = s.weight;
                              const T = e;
                              if (!(typeof a == "number" && isFinite(a)))
                                return o.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/24/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: { type: "number" },
                                    message: "must be number"
                                  }
                                ], !1;
                              var ze = T === e;
                            } else
                              var ze = !0;
                            if (ze)
                              if (s.caption !== void 0) {
                                const a = e;
                                if (typeof s.caption != "string")
                                  return o.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/24/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: { type: "string" },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var ze = a === e;
                              } else
                                var ze = !0;
                          }
                        } else
                          return o.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/24/properties/progress/type",
                              keyword: "type",
                              params: { type: "object" },
                              message: "must be object"
                            }
                          ], !1;
                      var ge = f === e;
                    } else
                      var ge = !0;
                    if (ge) {
                      if (r.step !== void 0) {
                        let s = r.step;
                        const f = e;
                        if (typeof s != "string")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/24/properties/step/type",
                              keyword: "type",
                              params: { type: "string" },
                              message: "must be string"
                            }
                          ], !1;
                        if (s !== "updateUserMeta")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/24/properties/step/const",
                              keyword: "const",
                              params: { allowedValue: "updateUserMeta" },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var ge = f === e;
                      } else
                        var ge = !0;
                      if (ge) {
                        if (r.meta !== void 0) {
                          let s = r.meta;
                          const f = e;
                          if (e === f && !(s && typeof s == "object" && !Array.isArray(s)))
                            return o.errors = [
                              {
                                instancePath: t + "/meta",
                                schemaPath: "#/oneOf/24/properties/meta/type",
                                keyword: "type",
                                params: { type: "object" },
                                message: "must be object"
                              }
                            ], !1;
                          var ge = f === e;
                        } else
                          var ge = !0;
                        if (ge)
                          if (r.userId !== void 0) {
                            let s = r.userId;
                            const f = e;
                            if (!(typeof s == "number" && isFinite(s)))
                              return o.errors = [
                                {
                                  instancePath: t + "/userId",
                                  schemaPath: "#/oneOf/24/properties/userId/type",
                                  keyword: "type",
                                  params: { type: "number" },
                                  message: "must be number"
                                }
                              ], !1;
                            var ge = f === e;
                          } else
                            var ge = !0;
                      }
                    }
                  }
                }
              } else
                return o.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/24/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (Y === "writeFile") {
            if (e === e)
              if (r && typeof r == "object" && !Array.isArray(r)) {
                let d;
                if (r.data === void 0 && (d = "data") || r.path === void 0 && (d = "path") || r.step === void 0 && (d = "step"))
                  return o.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/25/required",
                      keyword: "required",
                      params: { missingProperty: d },
                      message: "must have required property '" + d + "'"
                    }
                  ], !1;
                {
                  const F = e;
                  for (const s in r)
                    if (!(s === "progress" || s === "step" || s === "path" || s === "data"))
                      return o.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/25/additionalProperties",
                          keyword: "additionalProperties",
                          params: { additionalProperty: s },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (F === e) {
                    if (r.progress !== void 0) {
                      let s = r.progress;
                      const f = e;
                      if (e === f)
                        if (s && typeof s == "object" && !Array.isArray(s)) {
                          const A = e;
                          for (const a in s)
                            if (!(a === "weight" || a === "caption"))
                              return o.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/25/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: { additionalProperty: a },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (A === e) {
                            if (s.weight !== void 0) {
                              let a = s.weight;
                              const T = e;
                              if (!(typeof a == "number" && isFinite(a)))
                                return o.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/25/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: { type: "number" },
                                    message: "must be number"
                                  }
                                ], !1;
                              var Ve = T === e;
                            } else
                              var Ve = !0;
                            if (Ve)
                              if (s.caption !== void 0) {
                                const a = e;
                                if (typeof s.caption != "string")
                                  return o.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/25/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: { type: "string" },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var Ve = a === e;
                              } else
                                var Ve = !0;
                          }
                        } else
                          return o.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/25/properties/progress/type",
                              keyword: "type",
                              params: { type: "object" },
                              message: "must be object"
                            }
                          ], !1;
                      var be = f === e;
                    } else
                      var be = !0;
                    if (be) {
                      if (r.step !== void 0) {
                        let s = r.step;
                        const f = e;
                        if (typeof s != "string")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/25/properties/step/type",
                              keyword: "type",
                              params: { type: "string" },
                              message: "must be string"
                            }
                          ], !1;
                        if (s !== "writeFile")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/25/properties/step/const",
                              keyword: "const",
                              params: { allowedValue: "writeFile" },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var be = f === e;
                      } else
                        var be = !0;
                      if (be) {
                        if (r.path !== void 0) {
                          const s = e;
                          if (typeof r.path != "string")
                            return o.errors = [
                              {
                                instancePath: t + "/path",
                                schemaPath: "#/oneOf/25/properties/path/type",
                                keyword: "type",
                                params: { type: "string" },
                                message: "must be string"
                              }
                            ], !1;
                          var be = s === e;
                        } else
                          var be = !0;
                        if (be)
                          if (r.data !== void 0) {
                            let s = r.data;
                            const f = e, A = e;
                            let a = !1;
                            const T = e;
                            ee(s, {
                              instancePath: t + "/data",
                              parentData: r,
                              parentDataProperty: "data",
                              rootData: l
                            }) || (i = i === null ? ee.errors : i.concat(ee.errors), e = i.length);
                            var Ne = T === e;
                            if (a = a || Ne, !a) {
                              const de = e;
                              if (typeof s != "string") {
                                const Pe = {
                                  instancePath: t + "/data",
                                  schemaPath: "#/oneOf/25/properties/data/anyOf/1/type",
                                  keyword: "type",
                                  params: { type: "string" },
                                  message: "must be string"
                                };
                                i === null ? i = [Pe] : i.push(Pe), e++;
                              }
                              var Ne = de === e;
                              if (a = a || Ne, !a) {
                                const Pe = e;
                                if (e === Pe)
                                  if (s && typeof s == "object" && !Array.isArray(s)) {
                                    let he;
                                    if (s.BYTES_PER_ELEMENT === void 0 && (he = "BYTES_PER_ELEMENT") || s.buffer === void 0 && (he = "buffer") || s.byteLength === void 0 && (he = "byteLength") || s.byteOffset === void 0 && (he = "byteOffset") || s.length === void 0 && (he = "length")) {
                                      const Ze = {
                                        instancePath: t + "/data",
                                        schemaPath: "#/oneOf/25/properties/data/anyOf/2/required",
                                        keyword: "required",
                                        params: { missingProperty: he },
                                        message: "must have required property '" + he + "'"
                                      };
                                      i === null ? i = [Ze] : i.push(Ze), e++;
                                    } else {
                                      const Ze = e;
                                      for (const Q in s)
                                        if (!(Q === "BYTES_PER_ELEMENT" || Q === "buffer" || Q === "byteLength" || Q === "byteOffset" || Q === "length")) {
                                          let ce = s[Q];
                                          const Qe = e;
                                          if (!(typeof ce == "number" && isFinite(ce))) {
                                            const oe = {
                                              instancePath: t + "/data/" + Q.replace(/~/g, "~0").replace(/\//g, "~1"),
                                              schemaPath: "#/oneOf/25/properties/data/anyOf/2/additionalProperties/type",
                                              keyword: "type",
                                              params: { type: "number" },
                                              message: "must be number"
                                            };
                                            i === null ? i = [oe] : i.push(oe), e++;
                                          }
                                          var Ot = Qe === e;
                                          if (!Ot)
                                            break;
                                        }
                                      if (Ze === e) {
                                        if (s.BYTES_PER_ELEMENT !== void 0) {
                                          let Q = s.BYTES_PER_ELEMENT;
                                          const ce = e;
                                          if (!(typeof Q == "number" && isFinite(Q))) {
                                            const Qe = {
                                              instancePath: t + "/data/BYTES_PER_ELEMENT",
                                              schemaPath: "#/oneOf/25/properties/data/anyOf/2/properties/BYTES_PER_ELEMENT/type",
                                              keyword: "type",
                                              params: { type: "number" },
                                              message: "must be number"
                                            };
                                            i === null ? i = [Qe] : i.push(Qe), e++;
                                          }
                                          var ue = ce === e;
                                        } else
                                          var ue = !0;
                                        if (ue) {
                                          if (s.buffer !== void 0) {
                                            let Q = s.buffer;
                                            const ce = e;
                                            if (e === ce)
                                              if (Q && typeof Q == "object" && !Array.isArray(Q)) {
                                                let oe;
                                                if (Q.byteLength === void 0 && (oe = "byteLength")) {
                                                  const Je = {
                                                    instancePath: t + "/data/buffer",
                                                    schemaPath: "#/oneOf/25/properties/data/anyOf/2/properties/buffer/required",
                                                    keyword: "required",
                                                    params: {
                                                      missingProperty: oe
                                                    },
                                                    message: "must have required property '" + oe + "'"
                                                  };
                                                  i === null ? i = [Je] : i.push(Je), e++;
                                                } else {
                                                  const Je = e;
                                                  for (const Fe in Q)
                                                    if (Fe !== "byteLength") {
                                                      const Ce = {
                                                        instancePath: t + "/data/buffer",
                                                        schemaPath: "#/oneOf/25/properties/data/anyOf/2/properties/buffer/additionalProperties",
                                                        keyword: "additionalProperties",
                                                        params: {
                                                          additionalProperty: Fe
                                                        },
                                                        message: "must NOT have additional properties"
                                                      };
                                                      i === null ? i = [Ce] : i.push(Ce), e++;
                                                      break;
                                                    }
                                                  if (Je === e && Q.byteLength !== void 0) {
                                                    let Fe = Q.byteLength;
                                                    if (!(typeof Fe == "number" && isFinite(Fe))) {
                                                      const Ce = {
                                                        instancePath: t + "/data/buffer/byteLength",
                                                        schemaPath: "#/oneOf/25/properties/data/anyOf/2/properties/buffer/properties/byteLength/type",
                                                        keyword: "type",
                                                        params: {
                                                          type: "number"
                                                        },
                                                        message: "must be number"
                                                      };
                                                      i === null ? i = [Ce] : i.push(Ce), e++;
                                                    }
                                                  }
                                                }
                                              } else {
                                                const oe = {
                                                  instancePath: t + "/data/buffer",
                                                  schemaPath: "#/oneOf/25/properties/data/anyOf/2/properties/buffer/type",
                                                  keyword: "type",
                                                  params: { type: "object" },
                                                  message: "must be object"
                                                };
                                                i === null ? i = [oe] : i.push(oe), e++;
                                              }
                                            var ue = ce === e;
                                          } else
                                            var ue = !0;
                                          if (ue) {
                                            if (s.byteLength !== void 0) {
                                              let Q = s.byteLength;
                                              const ce = e;
                                              if (!(typeof Q == "number" && isFinite(Q))) {
                                                const oe = {
                                                  instancePath: t + "/data/byteLength",
                                                  schemaPath: "#/oneOf/25/properties/data/anyOf/2/properties/byteLength/type",
                                                  keyword: "type",
                                                  params: { type: "number" },
                                                  message: "must be number"
                                                };
                                                i === null ? i = [oe] : i.push(oe), e++;
                                              }
                                              var ue = ce === e;
                                            } else
                                              var ue = !0;
                                            if (ue) {
                                              if (s.byteOffset !== void 0) {
                                                let Q = s.byteOffset;
                                                const ce = e;
                                                if (!(typeof Q == "number" && isFinite(Q))) {
                                                  const oe = {
                                                    instancePath: t + "/data/byteOffset",
                                                    schemaPath: "#/oneOf/25/properties/data/anyOf/2/properties/byteOffset/type",
                                                    keyword: "type",
                                                    params: { type: "number" },
                                                    message: "must be number"
                                                  };
                                                  i === null ? i = [oe] : i.push(oe), e++;
                                                }
                                                var ue = ce === e;
                                              } else
                                                var ue = !0;
                                              if (ue)
                                                if (s.length !== void 0) {
                                                  let Q = s.length;
                                                  const ce = e;
                                                  if (!(typeof Q == "number" && isFinite(Q))) {
                                                    const oe = {
                                                      instancePath: t + "/data/length",
                                                      schemaPath: "#/oneOf/25/properties/data/anyOf/2/properties/length/type",
                                                      keyword: "type",
                                                      params: {
                                                        type: "number"
                                                      },
                                                      message: "must be number"
                                                    };
                                                    i === null ? i = [oe] : i.push(oe), e++;
                                                  }
                                                  var ue = ce === e;
                                                } else
                                                  var ue = !0;
                                            }
                                          }
                                        }
                                      }
                                    }
                                  } else {
                                    const he = {
                                      instancePath: t + "/data",
                                      schemaPath: "#/oneOf/25/properties/data/anyOf/2/type",
                                      keyword: "type",
                                      params: { type: "object" },
                                      message: "must be object"
                                    };
                                    i === null ? i = [he] : i.push(he), e++;
                                  }
                                var Ne = Pe === e;
                                a = a || Ne;
                              }
                            }
                            if (a)
                              e = A, i !== null && (A ? i.length = A : i = null);
                            else {
                              const de = {
                                instancePath: t + "/data",
                                schemaPath: "#/oneOf/25/properties/data/anyOf",
                                keyword: "anyOf",
                                params: {},
                                message: "must match a schema in anyOf"
                              };
                              return i === null ? i = [de] : i.push(de), e++, o.errors = i, !1;
                            }
                            var be = f === e;
                          } else
                            var be = !0;
                      }
                    }
                  }
                }
              } else
                return o.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/25/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (Y === "wp-cli") {
            if (e === e)
              if (r && typeof r == "object" && !Array.isArray(r)) {
                let d;
                if (r.command === void 0 && (d = "command") || r.step === void 0 && (d = "step"))
                  return o.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/26/required",
                      keyword: "required",
                      params: { missingProperty: d },
                      message: "must have required property '" + d + "'"
                    }
                  ], !1;
                {
                  const F = e;
                  for (const s in r)
                    if (!(s === "progress" || s === "step" || s === "command" || s === "wpCliPath"))
                      return o.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/26/additionalProperties",
                          keyword: "additionalProperties",
                          params: { additionalProperty: s },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (F === e) {
                    if (r.progress !== void 0) {
                      let s = r.progress;
                      const f = e;
                      if (e === f)
                        if (s && typeof s == "object" && !Array.isArray(s)) {
                          const A = e;
                          for (const a in s)
                            if (!(a === "weight" || a === "caption"))
                              return o.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/26/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: { additionalProperty: a },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (A === e) {
                            if (s.weight !== void 0) {
                              let a = s.weight;
                              const T = e;
                              if (!(typeof a == "number" && isFinite(a)))
                                return o.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/26/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: { type: "number" },
                                    message: "must be number"
                                  }
                                ], !1;
                              var He = T === e;
                            } else
                              var He = !0;
                            if (He)
                              if (s.caption !== void 0) {
                                const a = e;
                                if (typeof s.caption != "string")
                                  return o.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/26/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: { type: "string" },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var He = a === e;
                              } else
                                var He = !0;
                          }
                        } else
                          return o.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/26/properties/progress/type",
                              keyword: "type",
                              params: { type: "object" },
                              message: "must be object"
                            }
                          ], !1;
                      var we = f === e;
                    } else
                      var we = !0;
                    if (we) {
                      if (r.step !== void 0) {
                        let s = r.step;
                        const f = e;
                        if (typeof s != "string")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/26/properties/step/type",
                              keyword: "type",
                              params: { type: "string" },
                              message: "must be string"
                            }
                          ], !1;
                        if (s !== "wp-cli")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/26/properties/step/const",
                              keyword: "const",
                              params: { allowedValue: "wp-cli" },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var we = f === e;
                      } else
                        var we = !0;
                      if (we) {
                        if (r.command !== void 0) {
                          let s = r.command;
                          const f = e, A = e;
                          let a = !1;
                          const T = e;
                          if (typeof s != "string") {
                            const de = {
                              instancePath: t + "/command",
                              schemaPath: "#/oneOf/26/properties/command/anyOf/0/type",
                              keyword: "type",
                              params: { type: "string" },
                              message: "must be string"
                            };
                            i === null ? i = [de] : i.push(de), e++;
                          }
                          var dr = T === e;
                          if (a = a || dr, !a) {
                            const de = e;
                            if (e === de)
                              if (Array.isArray(s)) {
                                var Lr = !0;
                                const Pe = s.length;
                                for (let Ye = 0; Ye < Pe; Ye++) {
                                  const he = e;
                                  if (typeof s[Ye] != "string") {
                                    const Q = {
                                      instancePath: t + "/command/" + Ye,
                                      schemaPath: "#/oneOf/26/properties/command/anyOf/1/items/type",
                                      keyword: "type",
                                      params: { type: "string" },
                                      message: "must be string"
                                    };
                                    i === null ? i = [Q] : i.push(Q), e++;
                                  }
                                  var Lr = he === e;
                                  if (!Lr)
                                    break;
                                }
                              } else {
                                const Pe = {
                                  instancePath: t + "/command",
                                  schemaPath: "#/oneOf/26/properties/command/anyOf/1/type",
                                  keyword: "type",
                                  params: { type: "array" },
                                  message: "must be array"
                                };
                                i === null ? i = [Pe] : i.push(Pe), e++;
                              }
                            var dr = de === e;
                            a = a || dr;
                          }
                          if (a)
                            e = A, i !== null && (A ? i.length = A : i = null);
                          else {
                            const de = {
                              instancePath: t + "/command",
                              schemaPath: "#/oneOf/26/properties/command/anyOf",
                              keyword: "anyOf",
                              params: {},
                              message: "must match a schema in anyOf"
                            };
                            return i === null ? i = [de] : i.push(de), e++, o.errors = i, !1;
                          }
                          var we = f === e;
                        } else
                          var we = !0;
                        if (we)
                          if (r.wpCliPath !== void 0) {
                            const s = e;
                            if (typeof r.wpCliPath != "string")
                              return o.errors = [
                                {
                                  instancePath: t + "/wpCliPath",
                                  schemaPath: "#/oneOf/26/properties/wpCliPath/type",
                                  keyword: "type",
                                  params: { type: "string" },
                                  message: "must be string"
                                }
                              ], !1;
                            var we = s === e;
                          } else
                            var we = !0;
                      }
                    }
                  }
                }
              } else
                return o.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/26/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (Y === "setSiteLanguage") {
            if (e === e)
              if (r && typeof r == "object" && !Array.isArray(r)) {
                let d;
                if (r.language === void 0 && (d = "language") || r.step === void 0 && (d = "step"))
                  return o.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/27/required",
                      keyword: "required",
                      params: { missingProperty: d },
                      message: "must have required property '" + d + "'"
                    }
                  ], !1;
                {
                  const F = e;
                  for (const s in r)
                    if (!(s === "progress" || s === "step" || s === "language"))
                      return o.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/27/additionalProperties",
                          keyword: "additionalProperties",
                          params: { additionalProperty: s },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (F === e) {
                    if (r.progress !== void 0) {
                      let s = r.progress;
                      const f = e;
                      if (e === f)
                        if (s && typeof s == "object" && !Array.isArray(s)) {
                          const A = e;
                          for (const a in s)
                            if (!(a === "weight" || a === "caption"))
                              return o.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/27/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: { additionalProperty: a },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (A === e) {
                            if (s.weight !== void 0) {
                              let a = s.weight;
                              const T = e;
                              if (!(typeof a == "number" && isFinite(a)))
                                return o.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/27/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: { type: "number" },
                                    message: "must be number"
                                  }
                                ], !1;
                              var Ge = T === e;
                            } else
                              var Ge = !0;
                            if (Ge)
                              if (s.caption !== void 0) {
                                const a = e;
                                if (typeof s.caption != "string")
                                  return o.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/27/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: { type: "string" },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var Ge = a === e;
                              } else
                                var Ge = !0;
                          }
                        } else
                          return o.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/27/properties/progress/type",
                              keyword: "type",
                              params: { type: "object" },
                              message: "must be object"
                            }
                          ], !1;
                      var qe = f === e;
                    } else
                      var qe = !0;
                    if (qe) {
                      if (r.step !== void 0) {
                        let s = r.step;
                        const f = e;
                        if (typeof s != "string")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/27/properties/step/type",
                              keyword: "type",
                              params: { type: "string" },
                              message: "must be string"
                            }
                          ], !1;
                        if (s !== "setSiteLanguage")
                          return o.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/27/properties/step/const",
                              keyword: "const",
                              params: { allowedValue: "setSiteLanguage" },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var qe = f === e;
                      } else
                        var qe = !0;
                      if (qe)
                        if (r.language !== void 0) {
                          const s = e;
                          if (typeof r.language != "string")
                            return o.errors = [
                              {
                                instancePath: t + "/language",
                                schemaPath: "#/oneOf/27/properties/language/type",
                                keyword: "type",
                                params: { type: "string" },
                                message: "must be string"
                              }
                            ], !1;
                          var qe = s === e;
                        } else
                          var qe = !0;
                    }
                  }
                }
              } else
                return o.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/27/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else
            return o.errors = [
              {
                instancePath: t,
                schemaPath: "#/discriminator",
                keyword: "discriminator",
                params: { error: "mapping", tag: "step", tagValue: Y },
                message: 'value of tag "step" must be in oneOf'
              }
            ], !1;
        else
          return o.errors = [
            {
              instancePath: t,
              schemaPath: "#/discriminator",
              keyword: "discriminator",
              params: { error: "tag", tag: "step", tagValue: Y },
              message: 'tag "step" must be string'
            }
          ], !1;
      }
    } else
      return o.errors = [
        {
          instancePath: t,
          schemaPath: "#/type",
          keyword: "type",
          params: { type: "object" },
          message: "must be object"
        }
      ], !1;
  return o.errors = i, e === 0;
}
function B(r, { instancePath: t = "", parentData: n, parentDataProperty: p, rootData: l = r } = {}) {
  let i = null, e = 0;
  if (e === 0)
    if (r && typeof r == "object" && !Array.isArray(r)) {
      const J = e;
      for (const m in r)
        if (!mt.call(Rs.properties, m))
          return B.errors = [
            {
              instancePath: t,
              schemaPath: "#/additionalProperties",
              keyword: "additionalProperties",
              params: { additionalProperty: m },
              message: "must NOT have additional properties"
            }
          ], !1;
      if (J === e) {
        if (r.landingPage !== void 0) {
          const m = e;
          if (typeof r.landingPage != "string")
            return B.errors = [
              {
                instancePath: t + "/landingPage",
                schemaPath: "#/properties/landingPage/type",
                keyword: "type",
                params: { type: "string" },
                message: "must be string"
              }
            ], !1;
          var u = m === e;
        } else
          var u = !0;
        if (u) {
          if (r.description !== void 0) {
            const m = e;
            if (typeof r.description != "string")
              return B.errors = [
                {
                  instancePath: t + "/description",
                  schemaPath: "#/properties/description/type",
                  keyword: "type",
                  params: { type: "string" },
                  message: "must be string"
                }
              ], !1;
            var u = m === e;
          } else
            var u = !0;
          if (u) {
            if (r.meta !== void 0) {
              let m = r.meta;
              const R = e;
              if (e === R)
                if (m && typeof m == "object" && !Array.isArray(m)) {
                  let g;
                  if (m.title === void 0 && (g = "title") || m.author === void 0 && (g = "author"))
                    return B.errors = [
                      {
                        instancePath: t + "/meta",
                        schemaPath: "#/properties/meta/required",
                        keyword: "required",
                        params: { missingProperty: g },
                        message: "must have required property '" + g + "'"
                      }
                    ], !1;
                  {
                    const O = e;
                    for (const w in m)
                      if (!(w === "title" || w === "description" || w === "author" || w === "categories"))
                        return B.errors = [
                          {
                            instancePath: t + "/meta",
                            schemaPath: "#/properties/meta/additionalProperties",
                            keyword: "additionalProperties",
                            params: { additionalProperty: w },
                            message: "must NOT have additional properties"
                          }
                        ], !1;
                    if (O === e) {
                      if (m.title !== void 0) {
                        const w = e;
                        if (typeof m.title != "string")
                          return B.errors = [
                            {
                              instancePath: t + "/meta/title",
                              schemaPath: "#/properties/meta/properties/title/type",
                              keyword: "type",
                              params: { type: "string" },
                              message: "must be string"
                            }
                          ], !1;
                        var h = w === e;
                      } else
                        var h = !0;
                      if (h) {
                        if (m.description !== void 0) {
                          const w = e;
                          if (typeof m.description != "string")
                            return B.errors = [
                              {
                                instancePath: t + "/meta/description",
                                schemaPath: "#/properties/meta/properties/description/type",
                                keyword: "type",
                                params: { type: "string" },
                                message: "must be string"
                              }
                            ], !1;
                          var h = w === e;
                        } else
                          var h = !0;
                        if (h) {
                          if (m.author !== void 0) {
                            const w = e;
                            if (typeof m.author != "string")
                              return B.errors = [
                                {
                                  instancePath: t + "/meta/author",
                                  schemaPath: "#/properties/meta/properties/author/type",
                                  keyword: "type",
                                  params: { type: "string" },
                                  message: "must be string"
                                }
                              ], !1;
                            var h = w === e;
                          } else
                            var h = !0;
                          if (h)
                            if (m.categories !== void 0) {
                              let w = m.categories;
                              const $ = e;
                              if (e === $)
                                if (Array.isArray(w)) {
                                  var b = !0;
                                  const c = w.length;
                                  for (let N = 0; N < c; N++) {
                                    const L = e;
                                    if (typeof w[N] != "string")
                                      return B.errors = [
                                        {
                                          instancePath: t + "/meta/categories/" + N,
                                          schemaPath: "#/properties/meta/properties/categories/items/type",
                                          keyword: "type",
                                          params: { type: "string" },
                                          message: "must be string"
                                        }
                                      ], !1;
                                    var b = L === e;
                                    if (!b)
                                      break;
                                  }
                                } else
                                  return B.errors = [
                                    {
                                      instancePath: t + "/meta/categories",
                                      schemaPath: "#/properties/meta/properties/categories/type",
                                      keyword: "type",
                                      params: { type: "array" },
                                      message: "must be array"
                                    }
                                  ], !1;
                              var h = $ === e;
                            } else
                              var h = !0;
                        }
                      }
                    }
                  }
                } else
                  return B.errors = [
                    {
                      instancePath: t + "/meta",
                      schemaPath: "#/properties/meta/type",
                      keyword: "type",
                      params: { type: "object" },
                      message: "must be object"
                    }
                  ], !1;
              var u = R === e;
            } else
              var u = !0;
            if (u) {
              if (r.preferredVersions !== void 0) {
                let m = r.preferredVersions;
                const R = e;
                if (e === R)
                  if (m && typeof m == "object" && !Array.isArray(m)) {
                    let g;
                    if (m.php === void 0 && (g = "php") || m.wp === void 0 && (g = "wp"))
                      return B.errors = [
                        {
                          instancePath: t + "/preferredVersions",
                          schemaPath: "#/properties/preferredVersions/required",
                          keyword: "required",
                          params: { missingProperty: g },
                          message: "must have required property '" + g + "'"
                        }
                      ], !1;
                    {
                      const O = e;
                      for (const w in m)
                        if (!(w === "php" || w === "wp"))
                          return B.errors = [
                            {
                              instancePath: t + "/preferredVersions",
                              schemaPath: "#/properties/preferredVersions/additionalProperties",
                              keyword: "additionalProperties",
                              params: { additionalProperty: w },
                              message: "must NOT have additional properties"
                            }
                          ], !1;
                      if (O === e) {
                        if (m.php !== void 0) {
                          let w = m.php;
                          const $ = e, v = e;
                          let c = !1;
                          const N = e;
                          if (typeof w != "string") {
                            const L = {
                              instancePath: t + "/preferredVersions/php",
                              schemaPath: "#/definitions/SupportedPHPVersion/type",
                              keyword: "type",
                              params: { type: "string" },
                              message: "must be string"
                            };
                            i === null ? i = [L] : i.push(L), e++;
                          }
                          if (!(w === "8.3" || w === "8.2" || w === "8.1" || w === "8.0" || w === "7.4" || w === "7.3" || w === "7.2" || w === "7.1" || w === "7.0")) {
                            const L = {
                              instancePath: t + "/preferredVersions/php",
                              schemaPath: "#/definitions/SupportedPHPVersion/enum",
                              keyword: "enum",
                              params: { allowedValues: Ss.enum },
                              message: "must be equal to one of the allowed values"
                            };
                            i === null ? i = [L] : i.push(L), e++;
                          }
                          var k = N === e;
                          if (c = c || k, !c) {
                            const L = e;
                            if (typeof w != "string") {
                              const M = {
                                instancePath: t + "/preferredVersions/php",
                                schemaPath: "#/properties/preferredVersions/properties/php/anyOf/1/type",
                                keyword: "type",
                                params: { type: "string" },
                                message: "must be string"
                              };
                              i === null ? i = [M] : i.push(M), e++;
                            }
                            if (w !== "latest") {
                              const M = {
                                instancePath: t + "/preferredVersions/php",
                                schemaPath: "#/properties/preferredVersions/properties/php/anyOf/1/const",
                                keyword: "const",
                                params: { allowedValue: "latest" },
                                message: "must be equal to constant"
                              };
                              i === null ? i = [M] : i.push(M), e++;
                            }
                            var k = L === e;
                            c = c || k;
                          }
                          if (c)
                            e = v, i !== null && (v ? i.length = v : i = null);
                          else {
                            const L = {
                              instancePath: t + "/preferredVersions/php",
                              schemaPath: "#/properties/preferredVersions/properties/php/anyOf",
                              keyword: "anyOf",
                              params: {},
                              message: "must match a schema in anyOf"
                            };
                            return i === null ? i = [L] : i.push(L), e++, B.errors = i, !1;
                          }
                          var y = $ === e;
                        } else
                          var y = !0;
                        if (y)
                          if (m.wp !== void 0) {
                            const w = e;
                            if (typeof m.wp != "string")
                              return B.errors = [
                                {
                                  instancePath: t + "/preferredVersions/wp",
                                  schemaPath: "#/properties/preferredVersions/properties/wp/type",
                                  keyword: "type",
                                  params: { type: "string" },
                                  message: "must be string"
                                }
                              ], !1;
                            var y = w === e;
                          } else
                            var y = !0;
                      }
                    }
                  } else
                    return B.errors = [
                      {
                        instancePath: t + "/preferredVersions",
                        schemaPath: "#/properties/preferredVersions/type",
                        keyword: "type",
                        params: { type: "object" },
                        message: "must be object"
                      }
                    ], !1;
                var u = R === e;
              } else
                var u = !0;
              if (u) {
                if (r.features !== void 0) {
                  let m = r.features;
                  const R = e;
                  if (e === R)
                    if (m && typeof m == "object" && !Array.isArray(m)) {
                      const g = e;
                      for (const O in m)
                        if (O !== "networking")
                          return B.errors = [
                            {
                              instancePath: t + "/features",
                              schemaPath: "#/properties/features/additionalProperties",
                              keyword: "additionalProperties",
                              params: { additionalProperty: O },
                              message: "must NOT have additional properties"
                            }
                          ], !1;
                      if (g === e && m.networking !== void 0 && typeof m.networking != "boolean")
                        return B.errors = [
                          {
                            instancePath: t + "/features/networking",
                            schemaPath: "#/properties/features/properties/networking/type",
                            keyword: "type",
                            params: { type: "boolean" },
                            message: "must be boolean"
                          }
                        ], !1;
                    } else
                      return B.errors = [
                        {
                          instancePath: t + "/features",
                          schemaPath: "#/properties/features/type",
                          keyword: "type",
                          params: { type: "object" },
                          message: "must be object"
                        }
                      ], !1;
                  var u = R === e;
                } else
                  var u = !0;
                if (u) {
                  if (r.constants !== void 0) {
                    let m = r.constants;
                    const R = e;
                    if (e === R)
                      if (m && typeof m == "object" && !Array.isArray(m))
                        for (const g in m) {
                          const O = e;
                          if (typeof m[g] != "string")
                            return B.errors = [
                              {
                                instancePath: t + "/constants/" + g.replace(/~/g, "~0").replace(/\//g, "~1"),
                                schemaPath: "#/properties/constants/additionalProperties/type",
                                keyword: "type",
                                params: { type: "string" },
                                message: "must be string"
                              }
                            ], !1;
                          var E = O === e;
                          if (!E)
                            break;
                        }
                      else
                        return B.errors = [
                          {
                            instancePath: t + "/constants",
                            schemaPath: "#/properties/constants/type",
                            keyword: "type",
                            params: { type: "object" },
                            message: "must be object"
                          }
                        ], !1;
                    var u = R === e;
                  } else
                    var u = !0;
                  if (u) {
                    if (r.plugins !== void 0) {
                      let m = r.plugins;
                      const R = e;
                      if (e === R)
                        if (Array.isArray(m)) {
                          var S = !0;
                          const g = m.length;
                          for (let O = 0; O < g; O++) {
                            let w = m[O];
                            const $ = e, v = e;
                            let c = !1;
                            const N = e;
                            if (typeof w != "string") {
                              const j = {
                                instancePath: t + "/plugins/" + O,
                                schemaPath: "#/properties/plugins/items/anyOf/0/type",
                                keyword: "type",
                                params: { type: "string" },
                                message: "must be string"
                              };
                              i === null ? i = [j] : i.push(j), e++;
                            }
                            var I = N === e;
                            if (c = c || I, !c) {
                              const j = e;
                              ee(w, {
                                instancePath: t + "/plugins/" + O,
                                parentData: m,
                                parentDataProperty: O,
                                rootData: l
                              }) || (i = i === null ? ee.errors : i.concat(ee.errors), e = i.length);
                              var I = j === e;
                              c = c || I;
                            }
                            if (c)
                              e = v, i !== null && (v ? i.length = v : i = null);
                            else {
                              const j = {
                                instancePath: t + "/plugins/" + O,
                                schemaPath: "#/properties/plugins/items/anyOf",
                                keyword: "anyOf",
                                params: {},
                                message: "must match a schema in anyOf"
                              };
                              return i === null ? i = [j] : i.push(j), e++, B.errors = i, !1;
                            }
                            var S = $ === e;
                            if (!S)
                              break;
                          }
                        } else
                          return B.errors = [
                            {
                              instancePath: t + "/plugins",
                              schemaPath: "#/properties/plugins/type",
                              keyword: "type",
                              params: { type: "array" },
                              message: "must be array"
                            }
                          ], !1;
                      var u = R === e;
                    } else
                      var u = !0;
                    if (u) {
                      if (r.siteOptions !== void 0) {
                        let m = r.siteOptions;
                        const R = e;
                        if (e === R)
                          if (m && typeof m == "object" && !Array.isArray(m)) {
                            const g = e;
                            for (const O in m)
                              if (O !== "blogname") {
                                const w = e;
                                if (typeof m[O] != "string")
                                  return B.errors = [
                                    {
                                      instancePath: t + "/siteOptions/" + O.replace(/~/g, "~0").replace(/\//g, "~1"),
                                      schemaPath: "#/properties/siteOptions/additionalProperties/type",
                                      keyword: "type",
                                      params: { type: "string" },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var _ = w === e;
                                if (!_)
                                  break;
                              }
                            if (g === e && m.blogname !== void 0 && typeof m.blogname != "string")
                              return B.errors = [
                                {
                                  instancePath: t + "/siteOptions/blogname",
                                  schemaPath: "#/properties/siteOptions/properties/blogname/type",
                                  keyword: "type",
                                  params: { type: "string" },
                                  message: "must be string"
                                }
                              ], !1;
                          } else
                            return B.errors = [
                              {
                                instancePath: t + "/siteOptions",
                                schemaPath: "#/properties/siteOptions/type",
                                keyword: "type",
                                params: { type: "object" },
                                message: "must be object"
                              }
                            ], !1;
                        var u = R === e;
                      } else
                        var u = !0;
                      if (u) {
                        if (r.login !== void 0) {
                          let m = r.login;
                          const R = e, V = e;
                          let g = !1;
                          const O = e;
                          if (typeof m != "boolean") {
                            const $ = {
                              instancePath: t + "/login",
                              schemaPath: "#/properties/login/anyOf/0/type",
                              keyword: "type",
                              params: { type: "boolean" },
                              message: "must be boolean"
                            };
                            i === null ? i = [$] : i.push($), e++;
                          }
                          var W = O === e;
                          if (g = g || W, !g) {
                            const $ = e;
                            if (e === $)
                              if (m && typeof m == "object" && !Array.isArray(m)) {
                                let c;
                                if (m.username === void 0 && (c = "username") || m.password === void 0 && (c = "password")) {
                                  const N = {
                                    instancePath: t + "/login",
                                    schemaPath: "#/properties/login/anyOf/1/required",
                                    keyword: "required",
                                    params: { missingProperty: c },
                                    message: "must have required property '" + c + "'"
                                  };
                                  i === null ? i = [N] : i.push(N), e++;
                                } else {
                                  const N = e;
                                  for (const L in m)
                                    if (!(L === "username" || L === "password")) {
                                      const j = {
                                        instancePath: t + "/login",
                                        schemaPath: "#/properties/login/anyOf/1/additionalProperties",
                                        keyword: "additionalProperties",
                                        params: { additionalProperty: L },
                                        message: "must NOT have additional properties"
                                      };
                                      i === null ? i = [j] : i.push(j), e++;
                                      break;
                                    }
                                  if (N === e) {
                                    if (m.username !== void 0) {
                                      const L = e;
                                      if (typeof m.username != "string") {
                                        const j = {
                                          instancePath: t + "/login/username",
                                          schemaPath: "#/properties/login/anyOf/1/properties/username/type",
                                          keyword: "type",
                                          params: { type: "string" },
                                          message: "must be string"
                                        };
                                        i === null ? i = [j] : i.push(j), e++;
                                      }
                                      var X = L === e;
                                    } else
                                      var X = !0;
                                    if (X)
                                      if (m.password !== void 0) {
                                        const L = e;
                                        if (typeof m.password != "string") {
                                          const M = {
                                            instancePath: t + "/login/password",
                                            schemaPath: "#/properties/login/anyOf/1/properties/password/type",
                                            keyword: "type",
                                            params: { type: "string" },
                                            message: "must be string"
                                          };
                                          i === null ? i = [M] : i.push(M), e++;
                                        }
                                        var X = L === e;
                                      } else
                                        var X = !0;
                                  }
                                }
                              } else {
                                const c = {
                                  instancePath: t + "/login",
                                  schemaPath: "#/properties/login/anyOf/1/type",
                                  keyword: "type",
                                  params: { type: "object" },
                                  message: "must be object"
                                };
                                i === null ? i = [c] : i.push(c), e++;
                              }
                            var W = $ === e;
                            g = g || W;
                          }
                          if (g)
                            e = V, i !== null && (V ? i.length = V : i = null);
                          else {
                            const $ = {
                              instancePath: t + "/login",
                              schemaPath: "#/properties/login/anyOf",
                              keyword: "anyOf",
                              params: {},
                              message: "must match a schema in anyOf"
                            };
                            return i === null ? i = [$] : i.push($), e++, B.errors = i, !1;
                          }
                          var u = R === e;
                        } else
                          var u = !0;
                        if (u) {
                          if (r.phpExtensionBundles !== void 0) {
                            let m = r.phpExtensionBundles;
                            const R = e;
                            if (e === R)
                              if (Array.isArray(m)) {
                                var x = !0;
                                const g = m.length;
                                for (let O = 0; O < g; O++) {
                                  let w = m[O];
                                  const $ = e;
                                  if (typeof w != "string")
                                    return B.errors = [
                                      {
                                        instancePath: t + "/phpExtensionBundles/" + O,
                                        schemaPath: "#/definitions/SupportedPHPExtensionBundle/type",
                                        keyword: "type",
                                        params: { type: "string" },
                                        message: "must be string"
                                      }
                                    ], !1;
                                  if (!(w === "kitchen-sink" || w === "light"))
                                    return B.errors = [
                                      {
                                        instancePath: t + "/phpExtensionBundles/" + O,
                                        schemaPath: "#/definitions/SupportedPHPExtensionBundle/enum",
                                        keyword: "enum",
                                        params: {
                                          allowedValues: Ls.enum
                                        },
                                        message: "must be equal to one of the allowed values"
                                      }
                                    ], !1;
                                  var x = $ === e;
                                  if (!x)
                                    break;
                                }
                              } else
                                return B.errors = [
                                  {
                                    instancePath: t + "/phpExtensionBundles",
                                    schemaPath: "#/properties/phpExtensionBundles/type",
                                    keyword: "type",
                                    params: { type: "array" },
                                    message: "must be array"
                                  }
                                ], !1;
                            var u = R === e;
                          } else
                            var u = !0;
                          if (u) {
                            if (r.steps !== void 0) {
                              let m = r.steps;
                              const R = e;
                              if (e === R)
                                if (Array.isArray(m)) {
                                  var P = !0;
                                  const g = m.length;
                                  for (let O = 0; O < g; O++) {
                                    let w = m[O];
                                    const $ = e, v = e;
                                    let c = !1;
                                    const N = e;
                                    o(w, {
                                      instancePath: t + "/steps/" + O,
                                      parentData: m,
                                      parentDataProperty: O,
                                      rootData: l
                                    }) || (i = i === null ? o.errors : i.concat(o.errors), e = i.length);
                                    var D = N === e;
                                    if (c = c || D, !c) {
                                      const j = e;
                                      if (typeof w != "string") {
                                        const q = {
                                          instancePath: t + "/steps/" + O,
                                          schemaPath: "#/properties/steps/items/anyOf/1/type",
                                          keyword: "type",
                                          params: { type: "string" },
                                          message: "must be string"
                                        };
                                        i === null ? i = [q] : i.push(q), e++;
                                      }
                                      var D = j === e;
                                      if (c = c || D, !c) {
                                        const q = e, H = {
                                          instancePath: t + "/steps/" + O,
                                          schemaPath: "#/properties/steps/items/anyOf/2/not",
                                          keyword: "not",
                                          params: {},
                                          message: "must NOT be valid"
                                        };
                                        i === null ? i = [H] : i.push(H), e++;
                                        var D = q === e;
                                        if (c = c || D, !c) {
                                          const Z = e;
                                          if (typeof w != "boolean") {
                                            const U = {
                                              instancePath: t + "/steps/" + O,
                                              schemaPath: "#/properties/steps/items/anyOf/3/type",
                                              keyword: "type",
                                              params: { type: "boolean" },
                                              message: "must be boolean"
                                            };
                                            i === null ? i = [U] : i.push(U), e++;
                                          }
                                          if (w !== !1) {
                                            const U = {
                                              instancePath: t + "/steps/" + O,
                                              schemaPath: "#/properties/steps/items/anyOf/3/const",
                                              keyword: "const",
                                              params: { allowedValue: !1 },
                                              message: "must be equal to constant"
                                            };
                                            i === null ? i = [U] : i.push(U), e++;
                                          }
                                          var D = Z === e;
                                          if (c = c || D, !c) {
                                            const U = e;
                                            if (w !== null) {
                                              const G = {
                                                instancePath: t + "/steps/" + O,
                                                schemaPath: "#/properties/steps/items/anyOf/4/type",
                                                keyword: "type",
                                                params: { type: "null" },
                                                message: "must be null"
                                              };
                                              i === null ? i = [G] : i.push(G), e++;
                                            }
                                            var D = U === e;
                                            c = c || D;
                                          }
                                        }
                                      }
                                    }
                                    if (c)
                                      e = v, i !== null && (v ? i.length = v : i = null);
                                    else {
                                      const j = {
                                        instancePath: t + "/steps/" + O,
                                        schemaPath: "#/properties/steps/items/anyOf",
                                        keyword: "anyOf",
                                        params: {},
                                        message: "must match a schema in anyOf"
                                      };
                                      return i === null ? i = [j] : i.push(j), e++, B.errors = i, !1;
                                    }
                                    var P = $ === e;
                                    if (!P)
                                      break;
                                  }
                                } else
                                  return B.errors = [
                                    {
                                      instancePath: t + "/steps",
                                      schemaPath: "#/properties/steps/type",
                                      keyword: "type",
                                      params: { type: "array" },
                                      message: "must be array"
                                    }
                                  ], !1;
                              var u = R === e;
                            } else
                              var u = !0;
                            if (u)
                              if (r.$schema !== void 0) {
                                const m = e;
                                if (typeof r.$schema != "string")
                                  return B.errors = [
                                    {
                                      instancePath: t + "/$schema",
                                      schemaPath: "#/properties/%24schema/type",
                                      keyword: "type",
                                      params: { type: "string" },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var u = m === e;
                              } else
                                var u = !0;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else
      return B.errors = [
        {
          instancePath: t,
          schemaPath: "#/type",
          keyword: "type",
          params: { type: "object" },
          message: "must be object"
        }
      ], !1;
  return B.errors = i, e === 0;
}
function er(r, { instancePath: t = "", parentData: n, parentDataProperty: p, rootData: l = r } = {}) {
  let i = null, e = 0;
  return B(r, {
    instancePath: t,
    parentData: n,
    parentDataProperty: p,
    rootData: l
  }) || (i = i === null ? B.errors : i.concat(B.errors), e = i.length), er.errors = i, e === 0;
}
const { wpCLI: Ns, ...Br } = cs, Fs = {
  ...Br,
  "wp-cli": Ns,
  importFile: Br.importWxr
};
function Cs(r, {
  progress: t = new ur(),
  semaphore: n = new Tt({ concurrency: 3 }),
  onStepCompleted: p = () => {
  }
} = {}) {
  var y, E, S, I, _, W, X;
  r = {
    ...r,
    steps: (r.steps || []).filter(Ms).filter(Bs)
  };
  for (const x of r.steps)
    typeof x == "object" && x.step === "importFile" && (x.step = "importWxr", ae.warn(
      'The "importFile" step is deprecated. Use "importWxr" instead.'
    ));
  if (r.constants && r.steps.unshift({
    step: "defineWpConfigConsts",
    consts: r.constants
  }), r.siteOptions && r.steps.unshift({
    step: "setSiteOptions",
    options: r.siteOptions
  }), r.plugins) {
    const x = r.plugins.map((P) => typeof P == "string" ? P.startsWith("https://") ? {
      resource: "url",
      url: P
    } : {
      resource: "wordpress.org/plugins",
      slug: P
    } : P).map((P) => ({
      step: "installPlugin",
      pluginZipFile: P
    }));
    r.steps.unshift(...x);
  }
  r.login && r.steps.push({
    step: "login",
    ...r.login === !0 ? { username: "admin", password: "password" } : r.login
  }), r.phpExtensionBundles || (r.phpExtensionBundles = []), r.phpExtensionBundles || (r.phpExtensionBundles = []), r.phpExtensionBundles.length === 0 && r.phpExtensionBundles.push("kitchen-sink");
  const l = (y = r.steps) == null ? void 0 : y.findIndex(
    (x) => typeof x == "object" && (x == null ? void 0 : x.step) === "wp-cli"
  );
  l !== void 0 && l > -1 && (r.phpExtensionBundles.includes("light") && (r.phpExtensionBundles = r.phpExtensionBundles.filter(
    (x) => x !== "light"
  ), ae.warn(
    "The wpCli step used in your Blueprint requires the iconv and mbstring PHP extensions. However, you did not specify the kitchen-sink extension bundle. Playground will override your choice and load the kitchen-sink PHP extensions bundle to prevent the WP-CLI step from failing. "
  )), (E = r.steps) == null || E.splice(l, 0, {
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
  const i = (S = r.steps) == null ? void 0 : S.findIndex(
    (x) => typeof x == "object" && (x == null ? void 0 : x.step) === "importWxr"
  );
  i !== void 0 && i > -1 && (r.phpExtensionBundles.includes("light") && (r.phpExtensionBundles = r.phpExtensionBundles.filter(
    (x) => x !== "light"
  ), ae.warn(
    "The importWxr step used in your Blueprint requires the iconv and mbstring PHP extensions. However, you did not specify the kitchen-sink extension bundle. Playground will override your choice and load the kitchen-sink PHP extensions bundle to prevent the WP-CLI step from failing. "
  )), (I = r.steps) == null || I.splice(i, 0, {
    step: "installPlugin",
    pluginZipFile: {
      resource: "url",
      url: "https://playground.wordpress.net/wordpress-importer.zip",
      caption: "Downloading the WordPress Importer plugin"
    }
  }));
  const { valid: e, errors: u } = Is(r);
  if (!e) {
    const x = new Error(
      `Invalid blueprint: ${u[0].message} at ${u[0].instancePath}`
    );
    throw x.errors = u, x;
  }
  const h = r.steps || [], b = h.reduce(
    (x, P) => {
      var D;
      return x + (((D = P.progress) == null ? void 0 : D.weight) || 1);
    },
    0
  ), k = h.map(
    (x) => Us(x, {
      semaphore: n,
      rootProgressTracker: t,
      totalProgressWeight: b
    })
  );
  return {
    versions: {
      php: Ds(
        (_ = r.preferredVersions) == null ? void 0 : _.php,
        Ar,
        vs
      ),
      wp: ((W = r.preferredVersions) == null ? void 0 : W.wp) || "latest"
    },
    phpExtensions: Ws(
      [],
      r.phpExtensionBundles || []
    ),
    features: {
      // Disable networking by default
      networking: ((X = r.features) == null ? void 0 : X.networking) ?? !1
    },
    run: async (x) => {
      try {
        for (const { resources: P } of k)
          for (const D of P)
            D.setPlayground(x), D.isAsync && D.resolve();
        for (const [P, { run: D, step: J }] of Object.entries(k))
          try {
            const m = await D(x);
            p(m, J);
          } catch (m) {
            throw ae.error(m), new Error(
              `Error when executing the blueprint step #${P} (${JSON.stringify(
                J
              )}) ${m instanceof Error ? `: ${m.message}` : m}`,
              { cause: m }
            );
          }
      } finally {
        try {
          await x.goTo(
            r.landingPage || "/"
          );
        } catch {
        }
        t.finish();
      }
    }
  };
}
function Is(r) {
  var l;
  const t = er(r);
  if (t)
    return { valid: t };
  const n = /* @__PURE__ */ new Set();
  for (const i of er.errors)
    i.schemaPath.startsWith("#/properties/steps/items/anyOf") || n.add(i.instancePath);
  const p = (l = er.errors) == null ? void 0 : l.filter(
    (i) => !(i.schemaPath.startsWith("#/properties/steps/items/anyOf") && n.has(i.instancePath))
  );
  return {
    valid: t,
    errors: p
  };
}
function Ds(r, t, n) {
  return r && t.includes(r) ? r : n;
}
function Ws(r, t) {
  const n = ut.filter(
    (l) => r.includes(l)
  ), p = t.flatMap(
    (l) => l in Mr ? Mr[l] : []
  );
  return Array.from(/* @__PURE__ */ new Set([...n, ...p]));
}
function Ms(r) {
  return !!(typeof r == "object" && r);
}
function Bs(r) {
  return ["setPhpIniEntry", "request"].includes(r.step) ? (ae.warn(
    `The "${r.step}" Blueprint is no longer supported and you can remove it from your Blueprint.`
  ), !1) : !0;
}
function Us(r, {
  semaphore: t,
  rootProgressTracker: n,
  totalProgressWeight: p
}) {
  var k;
  const l = n.stage(
    (((k = r.progress) == null ? void 0 : k.weight) || 1) / p
  ), i = {};
  for (const y of Object.keys(r)) {
    let E = r[y];
    _s(E) && (E = Se.create(E, {
      semaphore: t
    })), i[y] = E;
  }
  const e = async (y) => {
    var E;
    try {
      return l.fillSlowly(), await Fs[r.step](
        y,
        await zs(i),
        {
          tracker: l,
          initialCaption: (E = r.progress) == null ? void 0 : E.caption
        }
      );
    } finally {
      l.finish();
    }
  }, u = Ur(i), h = Ur(i).filter(
    (y) => y.isAsync
  ), b = 1 / (h.length + 1);
  for (const y of h)
    y.progress = l.stage(b);
  return { run: e, step: r, resources: u };
}
function Ur(r) {
  const t = [];
  for (const n in r) {
    const p = r[n];
    p instanceof Se && t.push(p);
  }
  return t;
}
async function zs(r) {
  const t = {};
  for (const n in r) {
    const p = r[n];
    p instanceof Se ? t[n] = await p.resolve() : t[n] = p;
  }
  return t;
}
async function Vs(r, t) {
  await r.run(t);
}
function ui() {
}
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const ht = Symbol("Comlink.proxy"), Hs = Symbol("Comlink.endpoint"), Gs = Symbol("Comlink.releaseProxy"), wr = Symbol("Comlink.finalizer"), rr = Symbol("Comlink.thrown"), gt = (r) => typeof r == "object" && r !== null || typeof r == "function", Ys = {
  canHandle: (r) => gt(r) && r[ht],
  serialize(r) {
    const { port1: t, port2: n } = new MessageChannel();
    return Rr(r, t), [n, [n]];
  },
  deserialize(r) {
    return r.start(), Sr(r);
  }
}, Zs = {
  canHandle: (r) => gt(r) && rr in r,
  serialize({ value: r }) {
    let t;
    return r instanceof Error ? t = {
      isError: !0,
      value: {
        message: r.message,
        name: r.name,
        stack: r.stack
      }
    } : t = { isError: !1, value: r }, [t, []];
  },
  deserialize(r) {
    throw r.isError ? Object.assign(new Error(r.value.message), r.value) : r.value;
  }
}, xe = /* @__PURE__ */ new Map([
  ["proxy", Ys],
  ["throw", Zs]
]);
function Qs(r, t) {
  for (const n of r)
    if (t === n || n === "*" || n instanceof RegExp && n.test(t))
      return !0;
  return !1;
}
function Rr(r, t = globalThis, n = ["*"]) {
  t.addEventListener("message", function p(l) {
    if (!l || !l.data)
      return;
    if (!Qs(n, l.origin)) {
      console.warn(`Invalid origin '${l.origin}' for comlink proxy`);
      return;
    }
    const { id: i, type: e, path: u } = Object.assign({ path: [] }, l.data), h = (l.data.argumentList || []).map(Re);
    let b;
    try {
      const k = u.slice(0, -1).reduce((E, S) => E[S], r), y = u.reduce((E, S) => E[S], r);
      switch (e) {
        case "GET":
          b = y;
          break;
        case "SET":
          k[u.slice(-1)[0]] = Re(l.data.value), b = !0;
          break;
        case "APPLY":
          b = y.apply(k, h);
          break;
        case "CONSTRUCT":
          {
            const E = new y(...h);
            b = Pt(E);
          }
          break;
        case "ENDPOINT":
          {
            const { port1: E, port2: S } = new MessageChannel();
            Rr(r, S), b = ri(E, [E]);
          }
          break;
        case "RELEASE":
          b = void 0;
          break;
        default:
          return;
      }
    } catch (k) {
      b = { value: k, [rr]: 0 };
    }
    Promise.resolve(b).catch((k) => ({ value: k, [rr]: 0 })).then((k) => {
      const [y, E] = pr(k);
      t.postMessage(Object.assign(Object.assign({}, y), { id: i }), E), e === "RELEASE" && (t.removeEventListener("message", p), bt(t), wr in r && typeof r[wr] == "function" && r[wr]());
    }).catch((k) => {
      const [y, E] = pr({
        value: new TypeError("Unserializable return value"),
        [rr]: 0
      });
      t.postMessage(Object.assign(Object.assign({}, y), { id: i }), E);
    });
  }), t.start && t.start();
}
function Js(r) {
  return r.constructor.name === "MessagePort";
}
function bt(r) {
  Js(r) && r.close();
}
function Sr(r, t) {
  return $r(r, [], t);
}
function Ke(r) {
  if (r)
    throw new Error("Proxy has been released and is not useable");
}
function wt(r) {
  return Le(r, {
    type: "RELEASE"
  }).then(() => {
    bt(r);
  });
}
const or = /* @__PURE__ */ new WeakMap(), ar = "FinalizationRegistry" in globalThis && new FinalizationRegistry((r) => {
  const t = (or.get(r) || 0) - 1;
  or.set(r, t), t === 0 && wt(r);
});
function Ks(r, t) {
  const n = (or.get(t) || 0) + 1;
  or.set(t, n), ar && ar.register(r, t, r);
}
function Xs(r) {
  ar && ar.unregister(r);
}
function $r(r, t = [], n = function() {
}) {
  let p = !1;
  const l = new Proxy(n, {
    get(i, e) {
      if (Ke(p), e === Gs)
        return () => {
          Xs(l), wt(r), p = !0;
        };
      if (e === "then") {
        if (t.length === 0)
          return { then: () => l };
        const u = Le(r, {
          type: "GET",
          path: t.map((h) => h.toString())
        }).then(Re);
        return u.then.bind(u);
      }
      return $r(r, [...t, e]);
    },
    set(i, e, u) {
      Ke(p);
      const [h, b] = pr(u);
      return Le(r, {
        type: "SET",
        path: [...t, e].map((k) => k.toString()),
        value: h
      }, b).then(Re);
    },
    apply(i, e, u) {
      Ke(p);
      const h = t[t.length - 1];
      if (h === Hs)
        return Le(r, {
          type: "ENDPOINT"
        }).then(Re);
      if (h === "bind")
        return $r(r, t.slice(0, -1));
      const [b, k] = zr(u);
      return Le(r, {
        type: "APPLY",
        path: t.map((y) => y.toString()),
        argumentList: b
      }, k).then(Re);
    },
    construct(i, e) {
      Ke(p);
      const [u, h] = zr(e);
      return Le(r, {
        type: "CONSTRUCT",
        path: t.map((b) => b.toString()),
        argumentList: u
      }, h).then(Re);
    }
  });
  return Ks(l, r), l;
}
function ei(r) {
  return Array.prototype.concat.apply([], r);
}
function zr(r) {
  const t = r.map(pr);
  return [t.map((n) => n[0]), ei(t.map((n) => n[1]))];
}
const vt = /* @__PURE__ */ new WeakMap();
function ri(r, t) {
  return vt.set(r, t), r;
}
function Pt(r) {
  return Object.assign(r, { [ht]: !0 });
}
function ti(r, t = globalThis, n = "*") {
  return {
    postMessage: (p, l) => r.postMessage(p, n, l),
    addEventListener: t.addEventListener.bind(t),
    removeEventListener: t.removeEventListener.bind(t)
  };
}
function pr(r) {
  for (const [t, n] of xe)
    if (n.canHandle(r)) {
      const [p, l] = n.serialize(r);
      return [
        {
          type: "HANDLER",
          name: t,
          value: p
        },
        l
      ];
    }
  return [
    {
      type: "RAW",
      value: r
    },
    vt.get(r) || []
  ];
}
function Re(r) {
  switch (r.type) {
    case "HANDLER":
      return xe.get(r.name).deserialize(r.value);
    case "RAW":
      return r.value;
  }
}
function Le(r, t, n) {
  return new Promise((p) => {
    const l = si();
    r.addEventListener("message", function i(e) {
      !e.data || !e.data.id || e.data.id !== l || (r.removeEventListener("message", i), p(e.data));
    }), r.start && r.start(), r.postMessage(Object.assign({ id: l }, t), n);
  });
}
function si() {
  return new Array(4).fill(0).map(() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16)).join("-");
}
function _t(r, t = void 0) {
  ni();
  const n = r instanceof Worker ? r : ti(r, t), p = Sr(n), l = kt(p);
  return new Proxy(l, {
    get: (i, e) => e === "isConnected" ? async () => {
      for (; ; )
        try {
          await ii(p.isConnected(), 200);
          break;
        } catch {
        }
    } : p[e]
  });
}
async function ii(r, t) {
  return new Promise((n, p) => {
    setTimeout(p, t), r.then(n);
  });
}
let Vr = !1;
function ni() {
  if (Vr)
    return;
  Vr = !0, xe.set("EVENT", {
    canHandle: (n) => n instanceof CustomEvent,
    serialize: (n) => [
      {
        detail: n.detail
      },
      []
    ],
    deserialize: (n) => n
  }), xe.set("FUNCTION", {
    canHandle: (n) => typeof n == "function",
    serialize(n) {
      const { port1: p, port2: l } = new MessageChannel();
      return Rr(n, p), [l, [l]];
    },
    deserialize(n) {
      return n.start(), Sr(n);
    }
  }), xe.set("PHPResponse", {
    canHandle: (n) => typeof n == "object" && n !== null && "headers" in n && "bytes" in n && "errors" in n && "exitCode" in n && "httpStatusCode" in n,
    serialize(n) {
      return [n.toRawData(), []];
    },
    deserialize(n) {
      return nr.fromRawData(n);
    }
  });
  const r = xe.get("throw"), t = r == null ? void 0 : r.serialize;
  r.serialize = ({ value: n }) => {
    const p = t({ value: n });
    return n.response && (p[0].value.response = n.response), n.source && (p[0].value.source = n.source), p;
  };
}
function kt(r) {
  return new Proxy(r, {
    get(t, n) {
      switch (typeof t[n]) {
        case "function":
          return (...p) => t[n](...p);
        case "object":
          return t[n] === null ? t[n] : kt(t[n]);
        case "undefined":
        case "number":
        case "string":
          return t[n];
        default:
          return Pt(t[n]);
      }
    }
  });
}
new Promise((r) => {
});
async function oi({
  iframe: r,
  blueprint: t,
  remoteUrl: n,
  progressTracker: p = new ur(),
  disableProgressBar: l,
  onBlueprintStepCompleted: i,
  onClientConnected: e = () => {
  },
  sapiName: u,
  onBeforeBlueprint: h,
  siteSlug: b
}) {
  if (pi(n), ai(r), n = vr(n, {
    progressbar: !l
  }), p.setCaption("Preparing WordPress"), !t) {
    const E = await Hr(
      r,
      vr(n, {
        "php-extension": "kitchen-sink",
        "site-slug": b
      }),
      p
    );
    return e(E), E;
  }
  const k = Cs(t, {
    progress: p.stage(0.5),
    onStepCompleted: i
  }), y = await Hr(
    r,
    vr(n, {
      php: k.versions.php,
      wp: k.versions.wp,
      "sapi-name": u,
      "php-extension": k.phpExtensions,
      networking: k.features.networking ? "yes" : "no",
      "site-slug": b
    }),
    p
  );
  return Dt(ae, y), e(y), h && await h(), await Vs(k, y), p.finish(), y;
}
function ai(r) {
  var t, n;
  (t = r.sandbox) != null && t.length && !((n = r.sandbox) != null && n.contains("allow-storage-access-by-user-activation")) && r.sandbox.add("allow-storage-access-by-user-activation");
}
async function Hr(r, t, n) {
  await new Promise((i) => {
    r.src = t, r.addEventListener("load", i, !1);
  });
  const p = _t(
    r.contentWindow,
    r.ownerDocument.defaultView
  );
  await p.isConnected(), n.pipe(p);
  const l = n.stage();
  return await p.onDownloadProgress(l.loadingListener), await p.isReady(), l.finish(), p;
}
const tr = "https://playground.wordpress.net";
function pi(r) {
  const t = new URL(r, tr);
  if ((t.origin === tr || t.hostname === "localhost") && t.pathname !== "/remote.html")
    throw new Error(
      `Invalid remote URL: ${t}. Expected origin to be ${tr}/remote.html.`
    );
}
function vr(r, t) {
  const n = new URL(r, tr), p = new URLSearchParams(n.search);
  for (const [l, i] of Object.entries(t))
    if (i != null && i !== !1)
      if (Array.isArray(i))
        for (const e of i)
          p.append(l, e.toString());
      else
        p.set(l, i.toString());
  return n.search = p.toString(), n.toString();
}
async function di(r, t) {
  if (ae.warn(
    "`connectPlayground` is deprecated and will be removed. Use `startPlayground` instead."
  ), t != null && t.loadRemote)
    return oi({
      iframe: r,
      remoteUrl: t.loadRemote
    });
  const n = _t(
    r.contentWindow,
    r.ownerDocument.defaultView
  );
  return await n.isConnected(), n;
}
export {
  vs as LatestSupportedPHPVersion,
  Ar as SupportedPHPVersions,
  fi as SupportedPHPVersionsList,
  Tr as activatePlugin,
  et as activateTheme,
  Cs as compileBlueprint,
  di as connectPlayground,
  Qt as cp,
  nt as defineSiteUrl,
  sr as defineWpConfigConsts,
  Yt as enableMultisite,
  ts as exportWXR,
  ot as importThemeStarterContent,
  rs as importWordPressFiles,
  es as importWxr,
  ss as installPlugin,
  is as installTheme,
  Or as login,
  Kt as mkdir,
  Jt as mv,
  ie as phpVar,
  lr as phpVars,
  kr as request,
  ns as resetData,
  rt as rm,
  Xt as rmdir,
  Vs as runBlueprintSteps,
  Wt as runPHP,
  Mt as runPHPWithOptions,
  Bt as runSql,
  os as runWpInstallationWizard,
  li as setPhpIniEntries,
  ui as setPluginProxyURL,
  ds as setSiteLanguage,
  tt as setSiteOptions,
  oi as startPlaygroundWeb,
  jr as unzip,
  Ht as updateUserMeta,
  fs as wpCLI,
  Yr as wpContentFilesExcludedFromExport,
  it as writeFile,
  as as zipWpContent
};
