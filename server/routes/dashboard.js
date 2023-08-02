const router = require("express").Router();
const { ensureLoggedin } = require("../middlewares/misce");
const path = require('path')
const Page = require('../models/Page')


router.get('/',  ensureLoggedin, async(req, res)=>{
  res.render('dashboard', {layout: '../layouts/dashlayout'})
})


router.get("/create",  ensureLoggedin, async(req, res)=>{
  res.render("createpage", { layout: "../layouts/dashlayout", });

} )

router.post("/create", ensureLoggedin, async (req, res) => {
  let { ptitle, textcontent } = req.body;
  let fileName1;
  let fileName2;
  let data1;
  let data2;

  if (ptitle == "") {
    res.render("createpage", {
      layout: "../layouts/dashlayout",
      error_msg: "Provide Page title",
      ptitle,
      textcontent,
    });
  } else {
    if (req.files != null) {
      const files1 = req.files.coverImg;
      const files2 = req.files.sideImage;

      if (files1) {
        fileName1 = new Date().getTime().toString() + path.extname(files1.name);
        const savePath = path.resolve("public/img/uploads/" + fileName1);
        await files1.mv(savePath);
        data1 = fileName1;
        req.body.coverImg = data1;
      }
      if (files2) {
        fileName2 = new Date().getTime().toString() + path.extname(files2.name);
        const savePath2 = path.resolve("public/img/uploads/" + fileName2);
        await files2.mv(savePath2);
        data2 = fileName2;
        req.body.sideImage = data2;
      }
    }

    await Page.create(req.body);
    req.flash("success_msg", "New Page created");
    res.redirect("/d/create");
  }
});


// view all pages
router.get("/pages", ensureLoggedin, async (req, res) => {
  try {
    const allpages = await Page.find();

    res.render("allPages", { layout: "../layouts/dashlayout", allpages });
  } catch (error) {
    console.log(error);
  }
});


  // view one page

  router.get('/:slug', async(req, res)=>{
      try {
         
        const page = await Page.findOne({slug: req.params.slug})
         res.render("singlepage", {
           layout: "../layouts/layout",
           title: page.ptitle,
           page,
         });
        
      } catch (error) {
        console.log(error)
      }
  })




// Edit a Page

router.get("/page/:slug", ensureLoggedin, async (req, res) => {
  try {
    const page = await Page.findOne({slug:req.params.slug});

    res.render("editpage", { layout: "../layouts/dashlayout", page });

  } catch (error) {
    console.log(error);
  }
});

router.put("/page/:slug", ensureLoggedin, async (req, res) => {
  try {
    // verify the user
    if (req.user.isAdmin) {
      await Page.findOneAndUpdate(
        { slug: req.params.slug },
        { $set: req.body }
      );
      req.flash("success_msg", "Page Updated");
      res.redirect(`/d/page/${req.params.slug}`);
    } else {
      req.flash("error_msg", "Unauthorized");
      return res.redirect("/d/pages");
    }
  } catch (error) {
    console.log(error);
  }
});




// Delete page

router.delete("/delete/:id", ensureLoggedin, async (req, res) => {
  try {
    // verify the user
    if (req.user.isAdmin) {
      await Page.findByIdAndDelete(req.params.id);
      req.flash("success_msg", "Page Deleted");
      res.redirect("/d/pages");
    } else {
      req.flash("error_msg", "Unauthorized");
      return res.redirect("/d/pages");
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router