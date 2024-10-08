"""Create consulting models

Revision ID: f4c94de78820
Revises: 
Create Date: 2024-09-21 20:29:05.164675

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f4c94de78820'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('problems',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(), nullable=True),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('client', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('status', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_problems_id'), 'problems', ['id'], unique=False)
    op.create_index(op.f('ix_problems_title'), 'problems', ['title'], unique=False)
    op.create_table('segments',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('problem_id', sa.Integer(), nullable=True),
    sa.Column('parent_id', sa.Integer(), nullable=True),
    sa.Column('title', sa.String(), nullable=True),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('analysis', sa.Text(), nullable=True),
    sa.Column('potential_solution', sa.Text(), nullable=True),
    sa.Column('status', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['parent_id'], ['segments.id'], ),
    sa.ForeignKeyConstraint(['problem_id'], ['problems.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_segments_id'), 'segments', ['id'], unique=False)
    op.create_index(op.f('ix_segments_title'), 'segments', ['title'], unique=False)
    op.create_table('relationships',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('from_segment_id', sa.Integer(), nullable=True),
    sa.Column('to_segment_id', sa.Integer(), nullable=True),
    sa.Column('relationship_type', sa.String(), nullable=True),
    sa.Column('description', sa.Text(), nullable=True),
    sa.ForeignKeyConstraint(['from_segment_id'], ['segments.id'], ),
    sa.ForeignKeyConstraint(['to_segment_id'], ['segments.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_relationships_id'), 'relationships', ['id'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_relationships_id'), table_name='relationships')
    op.drop_table('relationships')
    op.drop_index(op.f('ix_segments_title'), table_name='segments')
    op.drop_index(op.f('ix_segments_id'), table_name='segments')
    op.drop_table('segments')
    op.drop_index(op.f('ix_problems_title'), table_name='problems')
    op.drop_index(op.f('ix_problems_id'), table_name='problems')
    op.drop_table('problems')
    # ### end Alembic commands ###
