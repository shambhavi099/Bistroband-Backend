const express = require("express");
const router = express.Router();

const {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getProfile,
  updateEmployeeStatus
} = require("../controllers/employee.controller");

const authMiddleware  = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post("/", authMiddleware, roleMiddleware(["Manager"]), createEmployee);
router.get(
    "/",
    authMiddleware,
    roleMiddleware(["Manager", "Chef"]),
    getAllEmployees
);

router.get("/me", authMiddleware,
  (req, res) => {  
    res.json({
      success: true,
      user: req.user,
    });
  }
);

router.get("/profile", authMiddleware, getProfile );

router.get("/:id", getEmployeeById);

router.put("/:id", updateEmployee);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware(["Manager", "Chef"]),
    deleteEmployee
);

router.patch(
  "/status/:id",
  authMiddleware,
  roleMiddleware(["Manager"]),
  updateEmployeeStatus
);

module.exports = router;