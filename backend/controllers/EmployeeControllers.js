import Employee from "../models/Employee.model.js";

export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, location, language } = req.body;
    if (!firstName || !lastName || !email || !location || !language)
      return res
        .status(404)
        .json({ message: "Please fill all the required fields" });
    const exist = await Employee.findOne({ email });
    if (exist)
      return res
        .status(400)
        .json({ message: "Employee with the given mail already exists" });
    const newEmployee = new Employee({
      firstName,
      lastName,
      email,
      password: lastName,
      language,
      location,
    });
    const result = await newEmployee.save();
    res
      .status(201)
      .json({ message: "Employee created successfully", data: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
export const getEmployeeDetails = async (req, res) => {
  try {
    const result = await Employee.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({ message: "Employee details fetched", data: result });
  } catch (error) {
    console.log("error in getEmployeeDetails", error);
    res.status(500).json({ message: error.message });
  }
};
export const getEmployeeDetailsById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Employee.findById(id).select("-password");
    if (!id)
      return res.status(400).json({ message: "Employee id is required" });
    if (!result)
      return res
        .status(500)
        .json({ message: "No employee found with the given id" });
    return res
      .status(200)
      .json({ message: "Employee details fetched successfully", data: result });
  } catch (error) {
    console.log("error while fetching emp details with id", error);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteEmp = async (req, res) => {
  try {
    console.log(req.params);
    const { id } = req.params;
    console.log(id);

    if (!id) {
      return res.status(400).json({ message: "Employee ID is required" });
    }

    const deletedEmp = await Employee.findByIdAndDelete(id);

    if (!deletedEmp) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.log("Error while deleting employee", error);
    return res.status(500).json({ message: error.message });
  }
};
