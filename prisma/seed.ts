// prisma/seed.ts

import { prisma } from "../lib/prisma";

async function main() {
    console.log(
        "Database seed complete."
    );
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });