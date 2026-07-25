# Implementation Details 
- Create two directories frontend and backend. 
- Use React ,tailwind, vite, typescript, bun for frontend
- In frontend, create all contents inside the container 1200px x max width of the display. The theme of the 
- website will based on emerald green color (#1A8917) with three links, DU, JNU, BHU. Then in the body part,
- Create three child containers, each of width 400px and max length of the display. Design These containers
- as Notice boards for the three college DU, JNU, BHU. All the new notices with respect to previous day
- should be marked new for the next two days. When user clicks on the links of universities on the navbar 
- i should open a new page dedicated to storing that university's notices and important links.

- In backend, use the typescript, nodeJS, bun, postgress, prisma, expressJS. Create three folders inside it,
- crawler, parser, and notifier. In Crawler, put the code which helps in visiting the url links (DU(https://www.du.ac.in/), BHU(https://admission.bhu.ac.in/en), 
JNU(https://jnuee.jnu.ac.in/)). There should be a cron job that will trigger the
- the job every day in the morning at 5 am IST. In Parser create all the logic which can help in 
- parsing the Notice boards and Important links sections if available of these websites. The content that 
- is intended to be parsed can be in the form of links or pdfs. If both link and pdf is present give 
- preference to links. In Notifier, all the collected links and pdfs are stored in postgress and displayed 
- on the frontend dashboard in their repective sections. If there has been any new notices with respect to 
- previous day, then only that notices are pushed to the frontend.