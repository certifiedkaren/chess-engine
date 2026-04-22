~~- make the evaluation always in terms of white~~
~~- make it evaluate in batches~~
~~- divide the analysis by 100 for each item~~
~~- bug: backend fails if one in chunk is null~~

- fix: when its already mate, make it return M0 or -M0. Use python chess to check fen in engine instead of stockfish
- make a bar to show the evaluation
- better styling for the analysis
- add loading bar while its generating the analysis array
- use docker container to run
- add sound effects, move, take, can't move there
- potential bug: importing another pgn when the last one isn't done
- prevent user from clicking the import button if its running
