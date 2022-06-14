# todo_backend

- API table

https://poised-mandible-7e9.notion.site/0b405df2532e4c7a8bdc85d1f10b74cb?v=bbc79126362745f59a34e1734aae04bc


PostgreSQL

이유: 

sql vs Nosql → 테이블에 컬럼, 데이터 같은게 정형화 되어 있으므로 sql을 사용한다. Nosql 예를 들어 몽고디비 같은거는 정형화 되지 않은 데이터가 들어가므로 적절하지 않다.

sql 중 MySql VS PosotgreSQL : MySql은 읽기 작업이 많을 때 용이하다. 하지만 todo에서는 쓰기 작업도 많으므로 MySQL보다 PostgreSQL을 사용한다.

     

- 태그
    - 생성일 : 사용자 눈에는 안보이고 DB에만 저장

