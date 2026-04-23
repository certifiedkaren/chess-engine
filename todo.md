~~- make the evaluation always in terms of white~~ <br>
~~- make it evaluate in batches~~ <br>
~~- divide the analysis by 100 for each item~~ <br>
~~- bug: backend fails if one in chunk is null~~ <br>
~~- fix: when its already mate, make it return M0 or -M0.~~ <br>
~~- fix: skip pgn import if its empty~~ <br>
~~- add sound effects: move, take, can't move there, game over, check, promotion~~<br>

- make a bar to show the evaluation
- better styling for the analysis
- make it so it evaluates and analyzes on user move (make new evaluate function for just 1 fen)
- add loading bar while its generating the analysis array
- use docker container to run
- potential bug: importing another pgn when the last one isn't done
- prevent user from clicking the import button if its running
