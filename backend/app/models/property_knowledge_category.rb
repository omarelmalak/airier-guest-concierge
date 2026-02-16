class PropertyKnowledgeCategory < ApplicationRecord
    belongs_to :property
    belongs_to :knowledge_category
end
