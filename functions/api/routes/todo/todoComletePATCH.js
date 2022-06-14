// 완료 체크
const Sequelize = require('sequelize');
const Todo = require('./../../../models/todo');
const Tag = require('./../../../models/tag');


module.exports = async (req, res) => {
    const {todoId} = req.params; // todo id
    

    // 완료 체크하면서 수정날짜와 완료날짜 업데이트
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

        // 이미 완료된 할 일인지 검사
        if(valid.is_completed === true) {
            return res.status(400).json(
            {
                message: "이미 완료한 할 일 입니다",
            });
        }



        const todos = await Todo.update({
            updated_at: Sequelize.fn('NOW'),
            completed_at: Sequelize.fn('NOW'),
            is_completed: true,
        }, {
            where: {id: todoId},
        }); 
        
        // response : id, 수정날짜, 완료날짜, 완료여부
        const updated_todo = await Todo.findOne({
            attributes: ['id', 'updated_at', 'completed_at', 'is_completed'],
            where: {id: todoId},
        })
        res.status(200).json(
            {
                todos: updated_todo,
                message: "완료 체크 성공",
            }
        );
    }
    catch(err) {
        res.status(400).json(
            {
                message: "완료 체크 실패",
            }
        );
        console.error("완료 체크 실패", err);
    }



};