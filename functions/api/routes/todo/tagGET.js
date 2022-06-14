// 태그별 조회
const Todo = require('./../../../models/todo');
const Tag = require('./../../../models/tag');



module.exports = async (req, res) => {
    // const {tags, sort} = req.query;
    // console.log("~~~~~~~~~~~~~~~~~~request query: tag, sort");
    // console.log(tags);
    // console.log(sort);

    // 태그 포함 전체 할 일 조회
    try {
        
        const todos = await Tag.findAll({
            order: [['id', "ASC"]],
            include: {
                model: Todo,
                where: {
                    is_deleted: false,
                },
                required: false, // 등록된 할 일이 없어도 태그가 보이도록
                through: {attributes: []} // 연결 테이블에서 가져올 컬럼
            },
            
        }); 
        res.status(200).json(
            {
                todos: todos,
                message: "태그별 할일 조회 성공",
            }
        );
    }
    catch(err) {
        res.status(400).json(
            {
                message: "태그별 할일 조회 실패",
            }
        );
        console.error("태그별 할일 조회 실패", err);
    }



};