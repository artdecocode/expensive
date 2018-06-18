const { spawn } = require('child_process')

const s = `activate application "Terminal"
tell application "System Events"
  set the_string to "${process.argv[2] || 'echo hello_world'}"
  repeat with the_character in the_string
    keystroke the_character
    delay (random number from 0.05 to 0.10)
  end repeat
  key code 36
end tell
`

spawn('osascript', ['-e', s])
