time = hslider("time", 1, 0, 4, 0.1);
amp = hslider("amplitude", 0.5, 0, 1, 0.1);

// the delay itself, using the recursion operator
delay(x) = +(x) ~ (amp * x@(44100 * time));

// main entry point
process = delay(_);