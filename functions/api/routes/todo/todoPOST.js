// 할 일 생성
const Sequelize = require('sequelize');
const Todo = require('./../../../models/todo');
const Tag = require('./../../../models/tag');
const db = require('./../../../models');


module.exports = async (req, res) => {    
    const {todo_name, description, target_date} = req.body; // 태그를 배열로 받음

    // 할 일 생성
    try {
        console.log("~~~~~~~~~~~todo_name:", todo_name);
        // 할일명이 비었다면 클라에게 에러 보내기
        if (!todo_name){
            return res.status(400).json(
                {
                    message: "할일명이 비었습니다",
                }
            )
        }
        

        // DB에 할 일 추가
        const todo = await Todo.create({
            todo_name: todo_name,
            description: description,
            target_date: target_date
        })
        

        res.status(200).json(
            {
                todo: todo,
                message: "할 일 생성 성공",
            }
        );
    }
    catch(err) {
        res.status(400).json(
            {
                message: "할 일 생성 실패",
            }
        );
        console.error("할 일 생성 실패", err);
    }

};