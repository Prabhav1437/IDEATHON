const { PrismaClient } = require('@prisma/client');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// GET /api/submissions - for admin view
app.get('/api/submissions', async (req, res) => {
    try {
        const submissions = await prisma.submission.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.json(submissions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// POST /api/submissions - new submission
app.post('/api/submissions', async (req, res) => {
    const {
        team_name,
        leader_name,
        leader_email,
        leader_urn,
        leader_github,
        leader_linkedin,
        leader_phone,
        leader_batch,
        member1_name,
        member1_email,
        member1_urn,
        member1_github,
        member1_linkedin,
        member1_phone,
        member1_batch,
        member2_name,
        member2_email,
        member2_urn,
        member2_github,
        member2_linkedin,
        member2_phone,
        member2_batch,
        team_size,
        college
    } = req.body;

    // Basic validation
    if (!team_name || !leader_name || !leader_email || !leader_urn || !leader_github || !leader_phone || !leader_batch ||
        !member1_name || !member1_email || !member1_urn || !member1_github || !member1_phone || !member1_batch ||
        !member2_name || !member2_email || !member2_urn || !member2_github || !member2_phone || !member2_batch) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Batch consistency validation
    if (leader_batch !== member1_batch || leader_batch !== member2_batch) {
        return res.status(400).json({ error: 'All team members must be from the same batch.' });
    }

    if (parseInt(team_size) !== 3) {
        return res.status(400).json({ error: 'Team size must be exactly 3 members' });
    }

    try {
        const submission = await prisma.submission.create({
            data: {
                teamName: team_name,
                leaderName: leader_name,
                leaderEmail: leader_email,
                leaderURN: leader_urn,
                leaderGithub: leader_github,
                leaderLinkedin: leader_linkedin,
                leaderPhone: leader_phone,
                leaderBatch: leader_batch,
                member1Name: member1_name,
                member1Email: member1_email,
                member1URN: member1_urn,
                member1Github: member1_github,
                member1Linkedin: member1_linkedin,
                member1Phone: member1_phone,
                member1Batch: member1_batch,
                member2Name: member2_name,
                member2Email: member2_email,
                member2URN: member2_urn,
                member2Github: member2_github,
                member2Linkedin: member2_linkedin,
                member2Phone: member2_phone,
                member2Batch: member2_batch,
                teamSize: parseInt(team_size),
                college: college || 'NST-Pune',
            },
        });
        res.status(201).json(submission);
    } catch (err) {
        // P2002 is Prisma's error code for unique constraint violation
        if (err.code === 'P2002') {
            return res.status(400).json({ error: 'Submission already exists for this team/email' });
        }
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    server.close();
});
