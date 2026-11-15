# Rhythm Walk

分からないままでも、一緒に鳴れる。

Play: https://tyty-cpu.github.io/rhythm-walk/

## Build 2026.11.15.1

- Tap to take one step; stopping input stops your movement.
- Preserve shoes/cat sound choices and the independent cane walker.
- Pause encounter time when the page is hidden. Resume on the next tap.
- Skip missed companion beats after a long frame gap rather than replaying them.
- Keep walking available if Web Audio is unavailable or waiting for permission.

This release incorporates the inspected November 13 tap-walking prototype and
reimplements the recorded November 15 pause/resume specification. The original
November 15 local artifact was not available for byte comparison. Further
encounter and timbre prototypes are not claimed as integrated.

## Verification

Run `node test.cjs` (no packages required). Tests exercise the actual embedded
script in a mocked DOM/clock: idle, rapid taps, boundaries, hidden/resume,
missed beats, pointer filtering, focused controls, and pending audio startup.
These are logic tests, not browser or audio-hardware validation.

Manual iPhone checks: irregular taps, stop for several seconds, switch apps for
30 seconds, return and tap, switch shoes/cat, mute/unmute, rotate screen.
Confirm no burst of old footsteps and no unsolicited audio before the resume tap.

## Continuing development

1. Read current main and inspect the live build before changing anything.
2. Work on a small development branch, run regression checks, inspect the diff.
3. Merge the tested change into main; wait for Pages Actions to succeed.
4. Check the build label and controls at the same public URL. Record commit SHA,
   checks, deployment result, device-only unknowns, and exactly one next step.

On November 15, the connector read API succeeded but create-branch returned
403 Resource not accessible by integration. The authenticated GitHub Web UI
successfully created dev/recovery-20261115. Use the authorized cloud-browser
Web UI as fallback; do not revoke OAuth or request passwords/tokens in chat.
Browser authentication can expire; do not assume it survives every scheduled run.
Do not create duplicate recurring tasks. The existing daily task owns continuity.

Keep score, MISS, combo, and rankings out. Large design changes and irreversible
actions require the author's approval. Preserve the previous playable commit:
8017324894a8818e3a7ee9330134f89bc2f57134. Rollback should be a new revert commit,
never a forced history rewrite.

Next: approach, walking alongside, and departure with continuous position and
volume transitions, without requiring the player to match the other walker.
