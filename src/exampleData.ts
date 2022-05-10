import type { Project } from './types'

export default [
  {
    id: 'project-1',
    title: 'Project 1',
    lanes: [
      {
        id: 'lane-1-1',
        title: 'To Do',
        tasks: [
          {
            id: 't10905',
            title: 'Task 1',
            description: 'Desc 1',
          },
          {
            id: 't10906',
            title: 'Task 2',
            description: 'Desc 2',
            dueDate: new Date(2022, 5, 12),
          },
        ],
      },
      {
        id: 'lane-1-2',
        title: 'Doing',
        tasks: [
          {
            id: 't10907',
            title: 'AAAAAA',
            description: 'ADADADaDAAd dsad',
            dueDate: new Date(2022, 4, 30),
          },
        ],
      },
      {
        id: 'lane-1-3',
        title: 'Done',
        tasks: [
          {
            id: 't10908',
            title: 'Task 0',
            description: '000000',
          },
          {
            id: 't10909',
            title: 'MPMPMPMPmpmpmp',
            description: 'Djkfjdksajfkdsam dsadsa',
          },
        ],
      },
    ],
  },
  {
    id: 'project-2',
    title: 'Project 2',
    lanes: [
      {
        id: 'lane-2-1',
        title: 'To Do',
        tasks: [
          {
            id: 't132321',
            title: 'Create FAQ page',
            description: 'Desc 1',
          },
          {
            id: 't132323',
            title: 'Write a review',
            description: 'Djkfjdksajfkdsam dsadsa',
            dueDate: new Date(2022, 4, 1),
          },
        ],
      },
      {
        id: 'lane-2-2',
        title: 'Doing',
        tasks: [
          {
            id: 't132322',
            title: 'Create landing page',
            description: 'ADADADaDAAd dsad',
            dueDate: new Date(2022, 4, 30),
          },
        ],
      },
      {
        id: 'lane-2-3',
        title: 'Done',
        tasks: [],
      },
    ],
  },
  {
    id: 'PROJECT 333',
    title: 'THIS IS A TEST',
    lanes: [],
  },
] as Project[]
