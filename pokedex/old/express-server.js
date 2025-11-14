const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json()); // Parse JSON body
const PORT = 8080;

let employees = [
    {id: 1, firstName: 'Jane', lastName: 'Doe'},
    {id: 2, firstName: 'John', lastName: 'Smith'}
];

app.get('/employees', (req,res) =>{
    res.status(200).json(employees);
});

app.get('/employees/:id', (req, res) =>{
    const employee = employees.find(e => e.id === parseInt(req.params.id));
    if(!employee) return res.status(404).send('Employee Not Found!');
    res.json(employee);
});

app.post('/employees', (req, res)=>{
    const { firstName, lastName} = req.body;
    if(!firstName || !lastName) return res.status(400).send('Missing Data!');
    const newEmployee = {id: employees.length+1, firstName, lastName};
    employees.push(newEmployee);
    res.status(201).json(newEmployee);
});

app.put('/employees/:id', (req, res) =>{
    const employee = employees.find(e => e.id === parseInt(req.params.id));
    if(!employee) return res.status(404).send('Employee not found!');
    const {firstName, lastName} = req.body;
    employee.firstName = firstName || employee.firstName;
    employee.lastName = lastName || employee.lastName;
    res.json(employee);
});

app.delete('/employees/:id', (req,res) => {
    employees = employees.filter(e => e.id !== parseInt(req.params.id));
    res.status(204).send();
});

app.listen(PORT, ()=>{
    console.log(`Server running at http://localhost:${PORT}`);
});

