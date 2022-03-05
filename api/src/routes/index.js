const { Router } = require('express');
const task = require('../models/Task');
const router = Router();


router.post('/create', async (req, res) => {
    // console.log(faker.image.imageUrl());
    // console.log(faker.name.title());
    // console.log(faker.lorem.paragraph());
    // res.json('data');
    // for (let i = 0; i < 100; i++) {
    //     await Article.create({
    //         title: faker.name.title(),
    //         imageURL: faker.image.imageUrl(),
    //         description: faker.lorem.paragraph()
    //     });
    // }
    // res.json({ message: '100 Records Created' });

    task.create(req.body);

    console.log(req.body);
    console.log("ok");
    res.json('Implemented');
});

router.get('/task', async (req, res) => {
    const tasks = await task.find();
    res.json({ tasks });
});
router.get('/removeTask', async (req, res) => {
    // const tasks = await task.find();
    // await task.remove({ _id: "621da435d38edf775ee5882e" });
    res.json("ok vamos a borrar");
});


module.exports = router;