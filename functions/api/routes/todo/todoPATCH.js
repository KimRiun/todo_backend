// 할 일 수정
const Sequelize = require('sequelize');
const Todo = require('./../../../models/todo');
const Tag = require('./../../../models/tag');


module.exports = async (req, res) => {
    const {todoId} = req.params; // todo id
    const {todo_name, description, target_date} = req.body;

    // 할 일 수정
    // 할일명, 상세설명, 마감목표일을 수정한다
    // 할일의 태그는 todoTagPOST.js와 todoTagDELETE.js를 통해 수정한다
    try {

        // id가 존재하는지 검사
        const valid = await Todo.findOne({
            where : { id: todoId }
        })

        if (!valid) {
            return res.status(400).json(
            {
                message: "존재하지 않는 id 입니다",
            });
        }

        // 일반 삭제된 할 일인지 검사
        if(valid.is_deleted === true) {
            return res.status(400).json(
            {
                message: "일반 삭제된 할 일 입니다",
            });
        }

        // 할일명이 비었다면 클라에게 에러 보내기
        if (!todo_name){
            return res.status(400).json(
                {
                    message: "할일명이 비었습니다",
                }
            )
        }
        
        // 할 일 수정
        const todos = await Todo.update({
            todo_name: todo_name,
            description: description,
            target_date: target_date,
            updated_at: Sequelize.fn('NOW'),
            completed_at: Sequelize.fn('NOW'),
        }, {
            where: {id: todoId},
        }); 
        
        // response : id, 할일명, 상세설명, 수정날짜, 마감목표일
        const updated_todo = await Todo.findOne({
            attributes: ['id', 'todo_name', 'description', 'updated_at',  'target_date'],
            where: {id: todoId},
        })
        res.status(200).json(
            {
                todos: updated_todo,
                message: "할일 수정 성공",
            }
        );
    }
    catch(err) {
        res.status(400).json(
            {
                message: "할일 수정 실패",
            }
        );
        console.error("할일 수정 실패", err);
    }



};