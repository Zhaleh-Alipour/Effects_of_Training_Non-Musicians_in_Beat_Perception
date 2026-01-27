## Visual Training Experiment
In this experiment, we had two visual trainning groups whose training matrial was slightly different. The file `VisTraining.psyexp` ccorresponds to the **first visual training group**.

---

## Running the Experiment for the Second Visual Training Group
To run the experiment using the stimuli for the **second visual training group**, follow the steps below.

Step 1: Duplicate the Experiment File
    - Create a copy of the existing .psyexp file.
    - Rename the copy appropriately (e.g., VisTraining2.psyexp).

Step 2: Modify the Stimuli Code

    1- Open the copied `.psyexp` file in PsychoPy.
    2- Navigate to the `code_2` routine.
    3- Open the `Code_3` component visible on the main workflow page.
    4- In the left panel (Python code) scroll down until you find the variable named `total`.

Step 3: Replace the `total` List

Replace the existing 12-line `total` list with the following:
```python
total=[[[3,1,4,1,3,1],[3,1,4,1,3,1],[3,1,4,3,1,1]],
[[3,1,4,2,2,1],[3,1,4,2,2,1],[1,3,4,2,2,1]],
[[2,1,1,1,3,4,1],[2,1,1,1,3,4,1],[2,1,1,3,1,4,1]],
[[3,1,1,3,2,2,1],[3,1,1,3,2,2,1],[3,1,3,1,2,2,1]],
[[2,1,1,4,1,3,1],[2,1,1,4,1,3,1],[2,1,1,4,3,1,1]],
[[3,1,2,2,1,3,1],[3,1,2,2,1,3,1],[3,1,2,2,3,1,1]],
[[4,2,2,1,1,2,1],[4,2,2,1,1,2,1],[4,2,2,2,1,1,1]],
[[1,1,2,3,1,2,2,1],[1,1,2,3,1,2,2,1],[1,1,2,1,3,2,2,1]],
[[2,1,1,2,2,3,1,1],[2,1,1,2,2,3,1,1],[2,1,1,2,2,1,3,1]],
[[1,1,2,2,1,1,4,1],[1,1,2,2,1,1,4,1],[1,1,2,1,1,2,4,1]],
[[3,1,2,1,1,1,3,1],[3,1,2,1,1,1,3,1],[3,1,2,1,1,3,1,1]],
[[3,1,2,2,1,1,2,1],[3,1,2,2,1,1,2,1],[1,3,2,2,1,1,2,1]]]
```

All other parts of the code can remain unchanged.

---

## Uploading and Running the Experiment
    - Save the modified `.psyexp` file.
    - Push the changes to GitHub using the commit interface (fill in the commit message and description as needed).
    - Once uploaded, the experiment is ready to be run for the second visual training group.
