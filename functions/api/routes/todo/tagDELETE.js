// 태그 삭제
const Sequelize = require('sequelize');
const Todo = require('./../../../models/todo');
const Tag = require('./../../../models/tag');
const db = require('./../../../models');


module.exports = async (req, res) => {
    const {tagId} = req.params; // tag id


    // 태그 삭제
    try {

        // id가 존재하는지 검사
        const valid = await Tag.findOne({
            where : { id: tagId }
        })

        if (!valid) {
            return res.status(400).json(
            {
                message: "존재하지 않는 id 입니다",
            });
        }



        // 해당 태그가 다른 할 일에 등록되어 있는지 검사
        const connected_tag = await db.sequelize.models.todo_tag.findOne({
            attributes: ['TagId'],
            where: { TagId : tagId }
        })
        console.log("~~~~connected_tag", connected_tag);
        
        if(!connected_tag) {
            // 연결된 할 일 없으므로 삭제 가능
            await Tag.destroy({
                where: { id : tagId }
            })
        }
        else {
            // 다른 할 일에 등록되어 있다면 삭제가 불가능
            return res.status(400).json(
                {
                    message: "다른 할 일에 이미 등록되어 있으므로 삭제할 수 없습니다",
                }
            );
        }

        const tags =  await Tag.findAll({
            attributes : ['id', 'tag_name']
        }); 

        
        res.status(200).json(
            {
                tags: tags,
                message: "태그 삭제 성공",
            }
        );
    }
    catch(err) {
        res.status(400).json(
            {
                message: "태그 삭제 실패",
            }
        );
        console.error("태그 삭제 실패", err);
    }



};