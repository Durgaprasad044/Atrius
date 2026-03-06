backend/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── profileController.ts
│   │   ├── postController.ts
│   │   ├── eventController.ts
│   │   └── matchController.ts
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── profileRoutes.ts
│   │   ├── postRoutes.ts
│   │   ├── eventRoutes.ts
│   │   └── matchRoutes.ts
│   ├── middleware/
│   │   ├── authMiddleware.ts
│   │   └── errorMiddleware.ts
│   ├── lib/
│   │   └── prisma.ts
│   └── index.ts
├── .env
├── package.json
└── tsconfig.json