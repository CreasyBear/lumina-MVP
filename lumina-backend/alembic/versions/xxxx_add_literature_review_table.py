"""add literature review table

Revision ID: xxxx
Revises: previous_revision
Create Date: YYYY-MM-DD HH:MM:SS

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'xxxx'
down_revision = 'previous_revision'
branch_labels = None
depends_on = None

def upgrade():
    op.create_table('literature_reviews',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('problem_id', sa.Integer(), nullable=True),
    sa.Column('title', sa.String(), nullable=True),
    sa.Column('content', sa.Text(), nullable=True),
    sa.Column('sources', postgresql.ARRAY(sa.String()), nullable=True),
    sa.ForeignKeyConstraint(['problem_id'], ['problems.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_literature_reviews_id'), 'literature_reviews', ['id'], unique=False)
    op.create_index(op.f('ix_literature_reviews_title'), 'literature_reviews', ['title'], unique=False)

def downgrade():
    op.drop_index(op.f('ix_literature_reviews_title'), table_name='literature_reviews')
    op.drop_index(op.f('ix_literature_reviews_id'), table_name='literature_reviews')
    op.drop_table('literature_reviews')