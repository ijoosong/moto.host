from sqlalchemy import Column, Integer, Text
from sqlalchemy.dialects.postgresql import JSON, JSONB

sqlalchemy.Table("jsontable", meta,
                Column('id', Integer),
                Column('name', Text),
                Column('email', Text),
                Column('doc', JSON))
meta.create_all()
